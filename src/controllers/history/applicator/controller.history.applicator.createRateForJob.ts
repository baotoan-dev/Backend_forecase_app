import { Request, Response, NextFunction } from "express"; 
import createError from "http-errors";
import applicationService from "../../../services/application/_service.application";
import logging from "../../../utils/logging";


const createRateForApplicationController = async (req: Request, res: Response, next: NextFunction) => {
    logging.info("Create rate for application controller start ...");
    const { id: recruiterId } = req.user;
    const { application_id: applicationId, rate, comment } = req.body;
    try {
        // CHECK REQUEST DATA VALID
        if (!applicationId || !rate) {
            logging.warning("Invalid application id or rate");
            return next(createError(400));
        }

        if (Number.isNaN(+applicationId) || Number.isNaN(+rate)) {
            logging.warning("Invalid application id or rate");
            return next(createError(400, "Invalid application id or rate"));
        }

        if (+rate < 1 || +rate > 5) {
            logging.warning("Invalid rate");
            return next(createError(400, "Invalid rate"));
        }

        if (comment && typeof comment !== "string") {
            logging.warning("Invalid comment");
            return next(createError(400, "Invalid comment"));
        }

        if (comment && comment.length > 500) {
            logging.warning("Comment is too long");
            return next(createError(400, "Comment is too long. Max length is 500 characters"));
        }

        // READ POST INFORMATION TO GET OWNER ID AND APPLICATION STATUS
        const application = await applicationService.read.readPostInformationByApplicationById(+applicationId);

        // CHECK APPLICATION
        if (!application) {
            logging.warning("Application not found");
            return next(createError(404, "Application not found"));
        }

        // CHECK RECRUITER
        if (application.ownerId !== recruiterId) {
            logging.warning("You cannot rate this application");
            return next(createError(404, "You cannot rate this application"));
        }

        // CHECK APPLICATION STATUS
        if (application.status !== 4 && application.status !== 5) {
            logging.warning("Application is not accepted");
            return next(createError(400, "Application is not accepted or is already rated"));
        }

        // CREATE RATE
        const rateResult = await applicationService.create.createRateForApplication(+applicationId, +rate, comment ?? null);

        // CHECK RATE RESULT
        if (!rateResult) {
            logging.warning("Create rate for application controller fail");
            return next(createError(500, "Create rate for application controller fail. Maybe application is already rated. Please try again later"));
        }

        res.status(201).json({
            code: 201,
            message: "Create rate for application controller success",
            success: true,
        });
    } catch (error) {
        logging.error(error);
        next(createError(500, "Internal server error"));
    }
}

export default createRateForApplicationController;