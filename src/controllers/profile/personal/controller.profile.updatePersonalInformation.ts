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
        const phone = bodyData.phone ? bodyData.phone.toString().trim() : null;

        
        // VALIDATION
        if (!name) {
            return next(createError(400, "Name is required"));
        }

        if (!phone) {
            return next(createError(400, "Phone is required"));
        }

        // UPDATE
        const isUpdateSuccess = await updatePersonalInformationService(
            id.toString(),
            name.toString().trim(),
            phone.toString().trim()
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
