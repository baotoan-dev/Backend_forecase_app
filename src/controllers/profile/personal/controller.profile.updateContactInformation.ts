import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import * as profileServices from "../../../services/profile/_service.profile";

const updateContactInformationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info(
            "Update contact information of profile controller start ..."
        );

        // GET PROFILE ID
        const { id } = req.user;
        if (!id) {
            logging.warning("Invalid profile id");
            return next(createError(401));
        }

        // GET BODY DATA
        const phone = req.body.phone ? req.body.phone.toString().trim() : null;
        const email = req.body.email ? req.body.email.toString().trim() : null;
        const facebook = req.body.facebook
            ? req.body.facebook.toString().trim()
            : null;
        const linkedin = req.body.linkedin
            ? req.body.linkedin.toString().trim()
            : null;

        // VALIDATION
        // if (!phone || !email) {
        //     logging.warning("Invalid phone or email");
        //     return next(createError(400));
        // }

        // UPDATE
        const isUpdatePhoneAndEmailSuccess =
            await profileServices.updateContactInformation(
                id,
                phone,
                email,
                facebook,
                linkedin
            );
        if (!isUpdatePhoneAndEmailSuccess) {
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
            "Update contact information of profile controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default updateContactInformationController;
