import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../utils/logging";
import * as postServices from "../../services/post/_service.post";
import rejectApplicationByPostIdService from "../../services/application/update/service.application.updateByPostId";

const updatePostStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Update post status controller start ...");

        // GET BODY DATA
        const postId = +req.body.id;
        const status = +req.body.status;

        // VALIDATION
        if (!Number.isInteger(postId) || postId <= 0) {
            logging.error("Invalid post id");
            return next(createError(400));
        }

        if (!Number.isInteger(status) || status < 0 || status > 3) {
            logging.warning("Invalid status value");
            return next(createError(400));
        }

        // HANDLE UPDATE
        const isUpdateStatusSuccess = await postServices.updateStatus(
            postId,
            status
        );
        if (!isUpdateStatusSuccess) {
            return next(createError(500));
        }

        if (status === 3) {
            // reject all applications if application status is not 4
            const isRejectAllApplicationsSuccess = rejectApplicationByPostIdService(postId, 3);
            if (!isRejectAllApplicationsSuccess) {
                return next(createError(500));
            }
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Update post status controller has error: ", error);
        return next(createError(500));
    }
};

export default updatePostStatusController;