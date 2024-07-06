import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

import logging from "../../utils/logging";
import { getLastOtpByPhoneNumberService } from "../../services/otp/_service.otp";
import Helper from "../../helpers/helper.class";
import signAccessTokenService from "../../services/jwt/service.jwt.signAccessToken";
import signRefreshTokenService from "../../services/jwt/service.jwt.signRefreshToken";
import readAccountByPhoneNumberService from "../../services/account/service.account.readByPhone";

const verifyPhoneNumberOtpController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Verify phoneNumber otp controller start ...");
        // GET OTP AND EMAIL
        const otp = req.body.otp ? req.body.otp.toString().trim() : "";
        let phoneNumber = req.body.phoneNumber
            ? req.body.phoneNumber.toString().trim()
            : "";

        // Helper
        const helper = new Helper();

        
        if (
            !otp ||
            !phoneNumber ||
            !helper.checkPhoneNumberFormat(phoneNumber)
            ) {
                return next(createError(400, "Invalid otp or phone number."));
            }
            
        if (otp.length !== 6) {
            return next(createError.BadRequest("Invalid otp."));
        }
        phoneNumber = helper.formatPhoneNumber(phoneNumber);

        //check otp status
        // if (!checkOtpStatus(otp, phoneNumber)) {
        //     logging.error("Expired otp");
        //     return next(createError.BadRequest());
        // }
        //VERIFY OTP SERVICE
        const lastOtpByPhoneNumber = await getLastOtpByPhoneNumberService(
            phoneNumber
        );

        if (
            lastOtpByPhoneNumber === null ||
            lastOtpByPhoneNumber === undefined ||
            lastOtpByPhoneNumber === ""
        ) {
            return next(createError(400, "Incorrect phone number"));
        }
        // COMPARE OTP
        if (lastOtpByPhoneNumber.otp !== otp) {
            return next(createError(400, "Incorrect OTP"));
        }

        // CHECK OTP EXPIRE
        // created_at + 60s > current time
        logging.info(
            "lastOtpByPhoneNumber.created_at",
            lastOtpByPhoneNumber.created_at
        );
        if (
            +new Date(lastOtpByPhoneNumber.created_at).getTime() + 60000 * 3 <=
            +new Date().getTime()
        ) {
            return next(createError(400, "OTP is expired"));
        }

        // GET ACCOUNT DATA BY EMAIL
        const accountData = await readAccountByPhoneNumberService(phoneNumber);

        // SIGN ACCESS TOKEN AND REFRESH TOKEN
        const accessToken = await signAccessTokenService({
            id: accountData.id,
            role: +accountData.role,
        });
        const refreshToken = await signRefreshTokenService({
            id: accountData.id,
            role: +accountData.role,
        });

        // SUCCESS
        return res.json({
            code: 200,
            success: true,
            data: {
                // isNew: false,
                id: accountData.id,
                accessToken,
                refreshToken,
            },
            message: "Verify phone number successfully",
        });
    } catch (error) {
        // ERROR
        logging.error("Verify phoneNumber otp controller has error: ", error);
        return next(createError.InternalServerError());
    }
};

export default verifyPhoneNumberOtpController;
