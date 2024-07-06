import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

import logging from "../../utils/logging";
import * as bookmarkServices from "../../services/bookmark/_service.bookmark";

const deleteBookmarkController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Delete bookmark controller start ...");

        if (!req.user || !req.user.id) {
            return createError(401);
        }

        const accountId = req.user.id;
        const postId = +req.body.postId;

        if (!Number.isInteger(postId)) {
            logging.warning("Invalid post id");
            return next(createError(400));
        }

        // DELETE BOOKMARK
        const isDeleteSuccess = await bookmarkServices.delete(
            accountId,
            postId
        );
        if (!isDeleteSuccess) {
            // console.log("Delete bookmark controller has error");
            return next(createError(500));
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Delete bookmark controller has error: ", error);
        return next(createError(500));
    }
};

export default deleteBookmarkController;
