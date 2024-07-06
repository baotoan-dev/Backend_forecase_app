import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import Helper from "../../helpers/helper.class";
import { readAccountByPhoneService } from "../../services/account/_service.account";
import createOtpService from "../../services/otp/service.otp.create";
// import Transport from "../../transport/transport";
import logging from "../../utils/logging";

const resendPhoneOTPController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        //HELPER
        const helper = new Helper();

        // GET ACCOUNT BY PHONE NUMBER
        const accountData = await readAccountByPhoneService(phoneNumber);
        if (!accountData) {
            return next(createError(404, "Phone number is not existed"));
        }

        // CREATE OTP
        const otp = helper.generateOTP();

        // Transporter
        // const transporter = new Transport();

        // SEND OTP TO PHONE NUMBER
        // transporter.sendOTPToPhoneNumber(
        //     `+${phoneNumber}`,
        //     `Your Hi Job OTP is: ${otp}`
        // );

        // CREATE OTP
        // const isCreateOtpSuccess = await createOtpService(otp, accountData.id);
        // if (!isCreateOtpSuccess) {
        //     return next(createError.InternalServerError());
        // }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Resend phone otp successfully",
        });
    } catch (error) {
        // ERROR
        logging.error("Resend phone controller has error: ", error);
        return next(createError(500));
    }
};

export default resendPhoneOTPController;
