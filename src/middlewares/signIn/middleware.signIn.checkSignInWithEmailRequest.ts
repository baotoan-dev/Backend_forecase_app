import logging from "../../utils/logging";
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { getLastOtpByEmailService } from "../../services/otp/_service.otp";
import removeUnnecessaryDots from "../../helpers/formatData/removeUnnecessaryDotsInEmail";
import isEmail from 'validator/lib/isEmail';

const checkSignInWithEmailRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        
        // GET EMAIL AND VALIDATE
        /*
            This middleware is used to validate email
            and remove unnecessary dots in email.
            Example:
                Input: "
                    email: "example.vn@gmail.com"
                "
                Output: "
                    email: "examplevn@gmail.com"
            
            Then, check OTP is still valid or not.
            If OTP is still valid, return 409 error.
            Else, continue to next middleware.
        */

        if (!req.body.email) {
            return next(createError(400, "Invalid email"));
        }

        let email = removeUnnecessaryDots(req.body.email.toString().trim());

        if (!isEmail(email)) {
            return next(createError(400, "Invalid email"));
        }

        // GET LAST OTP BY EMAIL
        const lastOtp = await getLastOtpByEmailService(email);

        // CHECK OTP IS STILL VALID
        // created_at + 60s < current time
        if (lastOtp) {
            if (
                +new Date(lastOtp.created_at).getTime() + 60000 * 3 >
                +new Date().getTime()
            ) {
                return next(createError(409, "Otp still expire"));
            }
        }

        // CAN REQUEST
        req.body.email = email;

        return next();
    } catch (error) {
        logging.error("Check sign in with email request error: ", error);
        return next(createError(500));
    }
};

export default checkSignInWithEmailRequest;
