import otpGenerator from 'otp-generator';
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import logging from "../../../utils/logging";
import { createOtpService } from "../../../services/otp/_service.otp";
import { sendEmailToUser } from '../../../configs/transport/transport';
import removeUnnecessaryDots from '../../../helpers/formatData/removeUnnecessaryDotsInEmail';
import isEmail from 'validator/lib/isEmail';

const resendEmailController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // GET EMAIL
        if (!req.body.email) {
            return next(createError(400, "Invalid email"));
        }

        let email = req.body.email;

        if (!isEmail(email)) {
            return next(createError(400, "Invalid email"));
        }
        
        // CREATE OTP
        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        // SEND EMAIL
        sendEmailToUser({
            to: email,
            subject: "Verify email",
            html: `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Mã xác minh OTP của bạn</title>
            </head>
            <body>
                <div>
                    <h2>Xin chào,</h2>
                    <p>Chúng tôi đã nhận được yêu cầu đăng nhập vào tài khoản của bạn. Dưới đây là mã xác minh OTP của bạn để hoàn tất đăng nhập:</p>
                    <h3>${otp}</h3>
                    <p>Vui lòng nhập mã xác minh này trong trang đăng nhập để hoàn tất quá trình đăng nhập.</p>
                    <p>Nếu bạn không yêu cầu đăng nhập này, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi ngay lập tức.</p>
                    <p>Trân trọng cảm ơn,</p>
                    <p>HBT,. ltd</p>
                </div>
            </body>
            </html>`,
        })

        // CREATE OTP
        const isCreateOtpSuccess = await createOtpService(otp, email, '1');

        if (!isCreateOtpSuccess) {
            return next(createError.InternalServerError());
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Resend email successfully",
        });
    } catch (error) {
        // ERROR
        logging.error("Resend email controller has error: ", error);
        return next(createError(500));
    }
};

export default resendEmailController;
