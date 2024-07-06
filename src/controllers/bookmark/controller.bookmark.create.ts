import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

import logging from "../../utils/logging";
import * as bookmarkServices from "../../services/bookmark/_service.bookmark";
import * as postServices from "../../services/post/_service.post";
const createBookmarkController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Create bookmark controller start ...");

        if (!req.user || !req.user.id) {
            return createError(401);
        }

        const accountId = req.user.id;
        const postId = +req.body.postId;

        if (!Number.isInteger(postId)) {
            logging.warning("Invalid post id");
            return next(createError(400));
        }

        const postInfo = await postServices.readPostById(+postId);

        if (!postInfo[0]) {
            return next(createError(404, "Post not found"));
        }

        if (postInfo[0].account_id === accountId) {
            return next(createError(406, "You cannot bookmark your own post"));
        }

        if (postInfo[0].status !== 1 && postInfo[0].status !== "1") {
            return next(createError(406, "Post is not available"));
        }

        // CREATE BOOKMARK
        const isCreateSuccess: boolean | string = await bookmarkServices.create(
            accountId,
            postId
        );

        // Author: Loops
        if (isCreateSuccess === "ER_DUP_ENTRY") {
            return next(createError(409, "You have already bookmarked this post"));
        }
        
        if (!isCreateSuccess) {
            return next(createError(500));
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Create bookmark controller has error: ", error);
        return next(createError(500));
    }
};

export default createBookmarkController;
