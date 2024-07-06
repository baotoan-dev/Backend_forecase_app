import otpGenerator from "otp-generator";
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import { createOtpService } from "../../../services/otp/_service.otp";
import { sendEmailToUser } from "../../../configs/transport/transport";
import generateOTPMail from "../../../html/mail/generateOTPMail";

const signInWithEmailController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Sign in with email controller start ...");
        // GET EMAIL (VALIDATED IN MIDDLEWARE)
        const email = req.body.email;

        // CREATE OTP
        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        // INSERT OTP TO DATABASE
        const isCreateOtpSuccess = await createOtpService(otp, email, '1');
        
        if (!isCreateOtpSuccess) {
            return next(createError(500));
        }

        // SEND EMAIL
        sendEmailToUser({
            to: email,
            subject: "Mã xác thực Jobs của bạn",
            html: generateOTPMail(otp, email),
        });
        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        // ERROR
        logging.error("Sign in with email controller has error: ", error);
        next(createError.InternalServerError());
    }
};

export default signInWithEmailController;
