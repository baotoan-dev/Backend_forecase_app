import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import { updatePersonalInformationService } from "../../../services/profile/_service.profile";

const updatePersonalInformationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info(
            "Update personal information of profile controller start ..."
        );

        // GET PROFILE ID
        const { id } = req.user;
        if (!id) {
            logging.warning("Invalid profile id");
            return next(createError(401));
        }

        // GET DATA
        const bodyData = req.body;
        const name = bodyData.name ? bodyData.name.toString().trim() : null;
        const birthday = +bodyData.birthday;
        const gender = +bodyData.gender;
        const address = bodyData.address ? bodyData.address.toString().trim() : null;
        const introduction = bodyData.introduction
            ? bodyData.introduction.toString().trim()
            : null;

        const jobTypeId = +bodyData.jobTypeId ? +bodyData.jobTypeId : null

        const jobTypeName = (bodyData.jobTypeName) ? bodyData.jobTypeName : (bodyData.jobTypeName === '') ? "" : null
        
        // VALIDATION
        if (
            !name ||
            !Number.isInteger(birthday) ||
            new Date(birthday).toString() === "Invalid Date" ||
            !Number.isInteger(gender) ||
            gender < 0 ||
            gender > 1  ||
            introduction && introduction.length > 500 ||
            (jobTypeId && !Number.isInteger(jobTypeId)) ||
            (jobTypeName && jobTypeName.length > 255)
        ) {
            logging.warning("Invalid body data");
            return next(createError(400));
        }

        // UPDATE
        const isUpdateSuccess = await updatePersonalInformationService(
            id.toString(),
            name.toString().trim(),
            birthday,
            gender,
            address ? address.toString().trim() : null,
            introduction ? introduction.toString().trim() : null,
            jobTypeId,
            jobTypeName
        );

        if (!isUpdateSuccess) {
            return next(createError(500, "Update personal information failed"));
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        logging.error(
            "Update personal information of profile controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default updatePersonalInformationController;
