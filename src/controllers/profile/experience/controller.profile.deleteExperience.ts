import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import * as profileExperienceServices from "../../../services/profileExperience/_service.profileExperience";

const deleteExperienceOfProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Delete experience of profile controller start ...");

        // GET PROFILE ID
        const { id } = req.user;
        if (!id) {
            logging.warning("Invalid profile id");
            return next(createError(401));
        }

        // GET BODY DATA
        const bodyData = req.body;
        const experienceIdForDelete = bodyData.experienceId
            ? +bodyData.experienceId
            : null;
        if (!Number.isInteger(experienceIdForDelete)) {
            logging.warning("Invalid data");
            return next(createError(400));
        }

        // HANDLE DELETE
        const isDeleteSuccess =
            await profileExperienceServices.deleteExperienceOfProfile(
                experienceIdForDelete
            );
        if (!isDeleteSuccess) {
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
            "Delete experience of profile controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default deleteExperienceOfProfileController;
