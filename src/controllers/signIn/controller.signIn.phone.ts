import createError from "http-errors";
import { Request, NextFunction, Response } from "express";
// import Helper from "../../helpers/helper.class";
// import createOtpService from "../../services/otp/service.otp.create";
// // import Transport from "../../transport/transport";
// import { v4 as uuidv4 } from "uuid";

import logging from "../../utils/logging";
// import {
//     createAccountWithPhoneService,
//     readAccountByPhoneService,
// } from "../../services/account/_service.account";
// import { createProfileWithAccountIdService } from "../../services/profile/_service.profile";

//1. Get phone number from request
//2. Check phone number is valid
//3. Send OTP to phone number
//4. Return success message

const signInWithPhoneController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //Get phone number from request
        // const phoneNumber: string = req.body.phoneNumber;

        // //Helper
        // const helper = new Helper();

        // //create otp
        // const OTP = helper.generateOTP();

        // //Transporter
        // const transporter = new Transport();

        // //Send OTP to phone number
        // transporter.sendOTPToPhoneNumber(
        //     `+${phoneNumber}`,
        //     `Your Hi Job OTP is: ${OTP}`
        // );

        // //try to find account by phone number
        // const account = await readAccountByPhoneService(phoneNumber);
        // let accountId: string;
        // if (!account) {
        //     accountId = uuidv4();
        //     // CREATE NEW ACCOUNT
        //     const isCreateAccountSuccess = await createAccountWithPhoneService(
        //         accountId,
        //         phoneNumber
        //     );
        //     logging.info(
        //         "Create Account With PhoneNumber Success: ",
        //         isCreateAccountSuccess
        //     );
        //     if (!isCreateAccountSuccess) {
        //         return next(createError.InternalServerError());
        //     }

        //     // CREATE PROFILE
        //     const isCreateProfileSuccess =
        //         await createProfileWithAccountIdService(accountId, null, phoneNumber, null);
        //     if (!isCreateProfileSuccess) {
        //         return next(createError(500));
        //     }
        // } else {
        //     accountId = account.id;
        // }

        // const optIdInserted = await createOtpService(OTP, accountId);

        // if (!optIdInserted) {
        //     return next(createError.InternalServerError());
        // } else {
        //     res.status(200).json({
        //         code: 200,
        //         success: true,
        //         message: "OTP sent to phone number",
        //     });
        // }
    } catch (error) {
        logging.error("Sign in with phone controller error: ", error);
        return next(createError.InternalServerError());
    }
};

export default signInWithPhoneController;
