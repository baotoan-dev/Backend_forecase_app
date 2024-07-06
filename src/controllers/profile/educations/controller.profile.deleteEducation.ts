import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import * as profileEducationServices from "../../../services/profileEducation/_service.profileEducation";

const deleteEducationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Delete education of profile controller start ...");

        // GET PROFILE ID
        const { id } = req.user;
        if (!id) {
            logging.warning("Invalid profile id");
            return next(createError(401));
        }

        // GET DATA
        const bodyData = req.body;
        const educationIdForDelete = bodyData.educationId
            ? +bodyData.educationId
            : null;
        if (!Number.isInteger(educationIdForDelete)) {
            logging.warning("Invalid data");
            return next(createError(400));
        }

        // HANDLE DELETE
        const isDeleteSuccess =
            await profileEducationServices.deleteEducationOfProfile(
                educationIdForDelete
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
            "Delete education of profile controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default deleteEducationController;
