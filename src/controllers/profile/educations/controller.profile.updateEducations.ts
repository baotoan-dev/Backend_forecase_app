import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import * as profileEducationServices from "../../../services/profileEducation/_service.profileEducation";

const updateEducationsOfProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Update educations of profile controller start ...");

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
            logging.warning("Invalid action");
            return next(createError(400));
        }

        // GET BODY DATA
        const bodyData = req.body;

        // SWITCH ACTION
        switch (action) {
            // CREATE
            case "c":
                logging.info("Action: Create");
                // GET DATA
                const companyNameForCreate = bodyData.companyName
                    ? bodyData.companyName.toString().trim()
                    : null;
                const majorForCreate = bodyData.major
                    ? bodyData.major.toString().trim()
                    : null;
                const startDateForCreate = +bodyData.startDate;
                const endDateForCreate = +bodyData.endDate;
                const extraInformationForCreate = bodyData.extraInformation
                    ? bodyData.extraInformation.toString().trim()
                    : null;
                const academicTypeIdForCreate = +bodyData.academicTypeId;

                // VALIDATION
                if (
                    !companyNameForCreate ||
                    !majorForCreate ||
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
                    await profileEducationServices.createEducationOfProfile(
                        id,
                        companyNameForCreate,
                        majorForCreate,
                        startDateForCreate,
                        endDateForCreate,
                        extraInformationForCreate,
                        academicTypeIdForCreate
                    );
                if (!isCreateSuccess) {
                    return next(createError(500));
                }
                break;

            // UPDATE
            case "u":
                logging.info("Action: Update");
                // GET DATA
                const educationIdForUpdate = bodyData.educationId
                    ? +bodyData.educationId
                    : null;
                const companyNameForUpdate = bodyData.companyName
                    ? bodyData.companyName.toString().trim()
                    : null;
                const majorForUpdate = bodyData.major
                    ? bodyData.major.toString().trim()
                    : null;
                const startDateForUpdate = +bodyData.startDate;
                const endDateForUpdate = +bodyData.endDate;
                const extraInformationForUpdate = bodyData.extraInformation
                    ? bodyData.extraInformation.toString().trim()
                    : null;
                const academicTypeIdForUpdate = +bodyData.academicTypeId;

                // VALIDATION
                if (
                    !Number.isInteger(educationIdForUpdate) ||
                    !companyNameForUpdate ||
                    !majorForUpdate ||
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
                    logging.warning("Invalid date value");
                    return next(createError(400));
                }

                if (startDateForUpdate > endDateForUpdate) {
                    logging.warning("Invalid date range");
                    return next(createError(400, "Invalid date range"));
                }

                // HANDLE UPDATE
                const isUpdateSuccess =
                    await profileEducationServices.updateEducationOfProfile(
                        educationIdForUpdate,
                        companyNameForUpdate,
                        majorForUpdate,
                        startDateForUpdate,
                        endDateForUpdate,
                        extraInformationForUpdate,
                        academicTypeIdForUpdate
                    );
                if (!isUpdateSuccess) {
                    return next(createError(500));
                }
                break;

            // DELETE
            case "d":
                logging.info("Action: Delete");
                // GET DATA
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
            "Update educations of profile controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default updateEducationsOfProfileController;
