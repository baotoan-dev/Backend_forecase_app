import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import logging from "../../../../utils/logging";
import * as postServices from "../../../../services/post/_service.post";
import { formatPostBeforeReturn } from "../../_controller.post.formatPostBeforeReturn";
import { PostResponse } from "../../../../models/interface/Post";
import readServiceStillByAccountIdService from "../../../../services/serviceHistory/read/service.readServiceStillByAccountId";

const readAcceptedPostsByThemeController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // logging.info("Read accepted posts by theme controller start ...");

        const themeId = +req.query.tid;
        const limit = req.query.limit;
        const page = req.query.page;

        if (!Number.isInteger(themeId) || themeId <= 0) {
            logging.warning("Invalid theme id");
            return next(createError(400));
        }

        const posts: any = await postServices.readAcceptedPostsByTheme(
            req.query.lang.toString(),
            themeId,
            page ? +page : 0,
            limit ? +limit : 10
        );

        if (!posts) {
            return next(createError(500));
        }

        const postResponse: PostResponse[] = await Promise.all(
            posts.posts.map(async (post: any) => {
                const dataType = await readServiceStillByAccountIdService(post.account_id);
                let convertDataType = '';

                if (Array.isArray(dataType) && dataType.length > 0) {
                    let max = dataType[0];

                    dataType.forEach((element) => {
                        if (element > max) {
                            max = element;
                        }
                    });

                    convertDataType = max;
                } else {
                    console.log("No valid service types found.");
                }
                post.serviceType = convertDataType ? convertDataType : null;
                return await formatPostBeforeReturn(post, req.query.lang.toString());
            })
        );

        res.locals.posts = postResponse;
        res.locals.currentPage = posts.currentPage;
        res.locals.totalPage = posts.totalPage;

        next();

    } catch (error) {
        logging.error(
            "Read accepted posts by theme controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default readAcceptedPostsByThemeController;
