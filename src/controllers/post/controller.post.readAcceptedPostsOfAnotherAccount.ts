import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../utils/logging";
import * as postServices from "../../services/post/_service.post";
import { formatPostBeforeReturn } from "./_controller.post.formatPostBeforeReturn";

const readAcceptedPostsOfAnotherAccountController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // logging.info("Read posts of another account controller start ...");

        const accountId = req.query.aid
            ? req.query.aid.toString().trim()
            : null;

        if (!accountId) {
            logging.warning("Invalid account id");
            return next(createError(400));
        }

        // READ ACCEPTED POSTS BY ACCOUNT ID
        const posts = await postServices.readAcceptedPostsByAccountId(
            accountId
        );

        // MODIFY
        // posts.forEach((post) => {
        //     post = formatPostBeforeReturn(post);
        // });

        await Promise.all(
            posts.map(async (post, index: number) => {
                posts[index] = await formatPostBeforeReturn(post);

            })
        );

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: posts,
            message: "Successfully",
        });
    } catch (error) {
        logging.error(
            "Read posts of another account controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default readAcceptedPostsOfAnotherAccountController;
