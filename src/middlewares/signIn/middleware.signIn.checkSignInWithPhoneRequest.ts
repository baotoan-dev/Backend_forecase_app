import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import Helper from "../../helpers/helper.class";
import logging from "../../utils/logging";
import { getLastOtpByPhoneNumberService } from "../../services/otp/_service.otp";

const signInWithPhoneNumberMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const phone = req.body.phoneNumber
            ? req.body.phoneNumber.toString().trim()
            : "";

        // if phone number has a unexpired otp, reject sign in request
        // else next to controller

        const helper = new Helper();
        if (phone === "" || !helper.checkPhoneNumberFormat(phone)) {
            console.log("Invalid phone number", phone);
            return next(createError(400, "Invalid phone number"));
        }
        const phoneNumber = helper.formatPhoneNumber(phone);

        // GET LAST OTP BY PHONE
        const lastOtpByPhoneNumber = await getLastOtpByPhoneNumberService(
            phoneNumber
        );
        if (!lastOtpByPhoneNumber) {
            req.body.phoneNumber = phoneNumber;
            return next();
        }

        // CHECK OTP IS STILL VALID
        if (
            +new Date(lastOtpByPhoneNumber.created_at).getTime() + 60000 >
            +new Date().getTime()
        ) {
            return next(createError(409, "Otp still expire"));
        }

        // CAN REQUEST
        req.body.phoneNumber = phoneNumber;
        return next();
    } catch (error) {
        logging.error(
            "Check sign in with phone request middleware error: ",
            error
        );
        return next(createError.InternalServerError());
    }
};

export default signInWithPhoneNumberMiddleware;
