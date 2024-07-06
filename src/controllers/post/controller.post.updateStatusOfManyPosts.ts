import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../utils/logging";
import * as postServices from "../../services/post/_service.post";

const updateStatusOfManyPostsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Update status of many posts controller start ...");

        // GET BODY DATA
        const postIds = req.body.ids;
        const status = +req.body.status;

        // VALIDATION
        if (!Array.isArray(postIds) || postIds.length <= 0) {
            logging.error("Invalid post ids");
            return next(createError(400));
        }

        if (!Number.isInteger(status) || status < 0 || status > 3) {
            logging.warning("Invalid status value");
            return next(createError(400));
        }

        // HANDLE UPDATE
        const isUpdateStatusSuccess =
            await postServices.updateStatusOfManyPosts(postIds, status);
        if (!isUpdateStatusSuccess) {
            return next(createError(500));
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        logging.error(
            "Update status of many posts controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default updateStatusOfManyPostsController;
