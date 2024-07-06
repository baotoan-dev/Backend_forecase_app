import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

import logging from "../../../../utils/logging";
import * as postServices from "../../../../services/post/_service.post";
import { formatPostBeforeReturn } from "../../_controller.post.formatPostBeforeReturn";
import readDefaultPostImageByPostId from "../../../../services/category/service.category.readDefaultPostImageByPostId";

const readAcceptedPostsInBookmarkController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Get limit and threshold from query
    const { limit, threshold, page } = req.query;

    try {
        logging.info("Read accepted posts in bookmark start ...");
    
        if (!req.user || !req.user.id) {
            return next(createError(401));
        }

        const accountId = req.user.id;

        const posts = await postServices.readAcceptedPostsInBookmark(
            req.query.lang.toString(),
            accountId, 
            +limit, 
            +page ? +page : 0
        );
        if (!posts) {
            throw new Error("Posts not found");
        }
        

        const data = await Promise.all(posts.map(async (post) => {
            const bookmark_id = post.bookmark_id;
            post = await formatPostBeforeReturn(post, req.query.lang.toString());
            post.bookmark_id = bookmark_id;
            return post;
        }));

        let isOver = false;

        if (posts.length < +limit) {
            isOver = true;
        }


        return res.status(200).json({
            code: 200,
            success: true,
            data: data,
            is_over: isOver,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Read accepted posts in bookmark has error: ", error);
        return next(createError(500));
    }
};

export default readAcceptedPostsInBookmarkController;
