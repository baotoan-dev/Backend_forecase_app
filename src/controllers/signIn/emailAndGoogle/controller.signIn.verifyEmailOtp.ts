import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import logging from "../../../utils/logging";
import { getLastOtpByEmailService } from "../../../services/otp/_service.otp";
import removeUnnecessaryDots from "../../../helpers/formatData/removeUnnecessaryDotsInEmail";
import isNumeric from 'validator/lib/isNumeric'
import isEmail from "validator/lib/isEmail";
import deleteOtpByEmailService from "../../../services/otp/service.otp.deleteOtpByEmail";

const verifyEmailOtpController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Verify email otp controller start ...");
        // GET OTP AND EMAIL
        if (!req.body.email || !req.body.otp) {
            return next(createError(400, "Invalid email or otp"));
        }
        const otp = req.body.otp.toString().trim();

        if (!isNumeric(otp, { no_symbols: true })) {
            return next(createError(400, "Invalid otp"));
        }

        let email = (req.body.email.toString().trim());

        if (!isEmail(email)) {
            return next(createError(400, "Invalid email"));
        }

            
        // GET LAST OTP BY EMAIL
        const lastOtpByEmail = await getLastOtpByEmailService(email);

        if (!lastOtpByEmail) {
            return next(createError(404, "Incorrect email"));
        }

        // COMPARE OTP
        if (lastOtpByEmail.otp !== otp) {
            return next(createError(409, "Incorrect otp"));
        }

        // CHECK OTP EXPIRE
        // created_at + 60s > current time
        if (
            +new Date(lastOtpByEmail.created_at).getTime() + 60000 * 3 <=
            +new Date().getTime()
        ) {
            return next(createError(400, "Otp expired"));
        }

        // deleteOtpByEmailService(email);

        req.body.emailRemovedDots = email;

        next();
    } catch (error) {
        // ERROR
        logging.error("Verify email otp controller has error: ", error);
        return next(createError(500));
    }
};

export default verifyEmailOtpController;
