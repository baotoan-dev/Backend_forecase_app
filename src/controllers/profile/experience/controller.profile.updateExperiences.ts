import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import * as profileExperienceServices from "../../../services/profileExperience/_service.profileExperience";

const updateExperiencesOfProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Update experiences of profile controller start ...");

        // GET PROFILE ID
        const { id } = req.user;
        if (!id) {
            logging.warning("Invalid profile id");
            return next(createError(401));
        }

        // GET ACTION
        const action = req.body.action
            ? req.body.action.toString().trim()
            : null;
        if (!action) {
            return next(createError(400, "Invalid action"));
        }

        // GET BODY DATA
        const bodyData = req.body;

        // SWITCH ACTION
        switch (action) {
            // CREATE
            case "c":
                logging.info("Action: Create");
                // GET DATA
                const titleForCreate = bodyData.title
                    ? bodyData.title.toString().trim()
                    : null;
                const companyNameForCreate = bodyData.companyName
                    ? bodyData.companyName.toString().trim()
                    : null;
                const startDateForCreate = +bodyData.startDate;
                const endDateForCreate = +bodyData.endDate;
                const extraInformationForCreate = bodyData.extraInformation
                    ? bodyData.extraInformation.toString().trim()
                    : null;

                // VALIDATION
                if (
                    !titleForCreate ||
                    !companyNameForCreate ||
                    !Number.isInteger(startDateForCreate) ||
                    !Number.isInteger(endDateForCreate)
                ) {
                    logging.warning("Invalid body data");
                    return next(createError(400));
                }

                if (
                    new Date(startDateForCreate).toString() ===
                        "Invalid Date" ||
                    new Date(endDateForCreate).toString() === "Invalid Date"
                ) {
                    logging.warning("Invalid date value");
                    return next(createError(400));
                }

                if (startDateForCreate > endDateForCreate) {
                    logging.warning("Invalid date range");
                    return next(createError(400, "Invalid date range"));
                }

                // HANDLE CREATE
                const isCreateSuccess =
                    await profileExperienceServices.createExperienceOfProfile(
                        id,
                        titleForCreate,
                        companyNameForCreate,
                        startDateForCreate,
                        endDateForCreate,
                        extraInformationForCreate
                    );
                if (!isCreateSuccess) {
                    return next(createError(500));
                }
                break;

            // UPDATE
            case "u":
                logging.info("Action: Update");
                // GET DATA
                const experienceIdForUpdate = bodyData.experienceId
                    ? +bodyData.experienceId
                    : null;
                const titleForUpdate = bodyData.title
                    ? bodyData.title.toString().trim()
                    : null;
                const companyNameForUpdate = bodyData.companyName
                    ? bodyData.companyName.toString().trim()
                    : null;
                const startDateForUpdate = +bodyData.startDate;
                const endDateForUpdate = +bodyData.endDate;
                const extraInformationForUpdate = bodyData.extraInformation
                    ? bodyData.extraInformation.toString().trim()
                    : null;

                // VALIDATION
                if (
                    !Number.isInteger(experienceIdForUpdate) ||
                    !companyNameForUpdate ||
                    !titleForUpdate ||
                    !Number.isInteger(startDateForUpdate) ||
                    !Number.isInteger(endDateForUpdate)
                ) {
                    logging.warning("Invalid data");
                    return next(createError(400));
                }

                if (
                    new Date(startDateForUpdate).toString() ===
                        "Invalid Date" ||
                    new Date(endDateForUpdate).toString() === "Invalid Date"
                ) {
                    return next(createError(400));
                }

                if (startDateForUpdate > endDateForUpdate) {
                    return next(createError(400, "Invalid date range"));
                }

                // HANDLE UPDATE
                const isUpdateSuccess =
                    await profileExperienceServices.updateExperienceOfProfile(
                        experienceIdForUpdate,
                        titleForUpdate,
                        companyNameForUpdate,
                        startDateForUpdate,
                        endDateForUpdate,
                        extraInformationForUpdate
                    );
                if (!isUpdateSuccess) {
                    return next(createError(500));
                }
                break;

            // DELETE
            case "d":
                logging.info("Action: Delete");
                // GET DATA
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
                break;

            // DEFAULT
            default:
                logging.warning("Invalid action");
                return next(createError(400));
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        logging.error(
            "Update experiences of profile controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default updateExperiencesOfProfileController;
