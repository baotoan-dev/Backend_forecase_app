import createError from "http-errors";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import logging from "../../../../utils/logging";
import * as postServices from "../../../../services/post/_service.post";
import * as bookmarkServices from "../../../../services/bookmark/_service.bookmark";
// import MoneyType from "../../enum/money_type.enum";
import { formatPostBeforeReturn } from "../../_controller.post.formatPostBeforeReturn";
import { isArrayNumber, isNumber } from "../../../../helpers/checkData/checkTypeOfData";
import { PostResponse, PostService } from "../../../../models/interface/Post";
import { formatToArrayNumber, formatToStringNumberArray } from "../../../../helpers/formatData/formatArray";
import { checkBookmark } from "../../../../middlewares/checkBookmark";

interface Payload {
    id: string;
    role: number;
}

const readNewestAcceptedPostsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // logging.info("Read newest accepted posts controller start ...");

        // GET QUERY PARAMETERS
        const parentCategoryId = req.query.pcid;
        const childCategoryIds = req.query.ccid;
        const districtIds = req.query.dtid;
        const limit = req.query.limit;
        const threshold = req.query.threshold;

        // VALIDATION
        // PARENT CATEGORY ID
        if (parentCategoryId && isNumber(parentCategoryId) === false || +parentCategoryId <= 0) {
            logging.warning("Invalid parent category id value");
            return next(createError(400, "Invalid parent category id value"));
        }

        let isError = false;

        // CHILD CATEGORY IDS
        if (childCategoryIds) {
            if (Array.isArray(childCategoryIds)) {
                if(isArrayNumber(childCategoryIds) === false) {
                    return next(createError(400, "Invalid child category id value"));
                }
            } else if (isNumber(childCategoryIds) === false || +childCategoryIds <= 0) {
                logging.warning("Invalid child category id value");
                return next(createError(400, "Invalid child category id value"));
            }
        }

        // DISTRICT IDS
        if (districtIds) {
            if (Array.isArray(districtIds)) {
                if (isArrayNumber(districtIds) === false) {
                    return next(createError(400, "Invalid district id value"));
                }
            } else if (isNumber(districtIds) === false || +districtIds <= 0) {
                logging.warning("Invalid district id value");
                return next(createError(400));
            }
        }


        // GET DATA
        let posts: PostService[];
        if (childCategoryIds && districtIds) {
            // logging.info(
            //     "Read newest accepted posts by child categories and districts"
            // );
            posts =
                await postServices.readNewestAcceptedPostsByChildCategoriesAndDistricts(
                    req.query.lang.toString(),
                    formatToArrayNumber(childCategoryIds),
                    formatToStringNumberArray(districtIds),
                    +limit + 1,
                    threshold ? +threshold : null
                );
        } else if (parentCategoryId && districtIds) {
            logging.info(
                "Read newest accepted posts by parent category and districts"
            );
            posts =
                await postServices.readNewestAcceptedPostsByParentCategoryAndDistricts(
                    req.query.lang.toString(),
                    +parentCategoryId,
                    formatToStringNumberArray(districtIds),
                    +limit + 1,
                    threshold ? +threshold : null
                );
        } else if (districtIds) {
            logging.info("Read newest accepted posts by districts");
            posts = await postServices.readNewestAcceptedPostsByDistricts(
                req.query.lang.toString(),
                formatToStringNumberArray(districtIds),
                +limit + 1,
               threshold ? +threshold : null
            );
        } else if (childCategoryIds) {
            logging.info("Read newest accepted posts by child categories");
            posts = await postServices.readNewestAcceptedPostsByChildCategories(
                req.query.lang.toString(),
                formatToArrayNumber(childCategoryIds),
                +limit + 1,
                threshold ? +threshold : null
            );
        } else if (parentCategoryId) {
            logging.info("Read newest accepted posts by parent category");
            posts = await postServices.readNewestAcceptedPostsByParentCategory(
                req.query.lang.toString(),
                +parentCategoryId,
                +limit + 1,
                threshold ? +threshold : null
            );
        } else {
            logging.info("Read newest accepted posts");
            posts = await postServices.readNewestAcceptedPosts(
                req.query.lang.toString(),  
               +limit + 1,
                threshold ? +threshold : null
            );
        }

        if (!posts) {
            return next(createError(500));
        }

        // MODIFY
        let postResponses: PostResponse[] = await Promise.all(
            posts.map(async (post) => {
                return await formatPostBeforeReturn(post, req.query.lang.toString());
            })
        );
        res.locals.posts = postResponses;
        next();
    
    } catch (error) {
        logging.error(
            "Read newest accepted posts controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default readNewestAcceptedPostsController;
