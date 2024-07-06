import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import sgMail from "@sendgrid/mail";

import logging from "../../utils/logging";
import * as accountServices from "../../services/account/_service.account";
import createProfileWithAccountIdService from "../../services/profile/service.profile.createWithAccountId";
import { sendEmailToUser } from "../../configs/transport/transport";

interface Payload {
    id: string;
    role: number;
}

// REMOVE INVALID DOT CHARS FROM EMAIL

const adminSignUpController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Admin sign up controller start ...");

        const ROLE = 2
        const email = req.body.email
            ? (req.body.email.toString().trim())
            : "";

        // Check email was existed?
        const account = await accountServices.readAccountByEmailService(email);

        if (account) {

            await accountServices.updateRolesForAccountService(account.id, 2);

            sendEmailToUser({
                to: email,
                subject: "HCMUTE Job: Account Password",
                html: `<!DOCTYPE html>
                <html>
                <head>
                    <title>HCMUTE: Account Password</title>
                </head>
                <body>
                    <div>
                        Đăng ký thành công tài khoản admin cho email: <b>${email}</b>
                        <br>
                        Mât khẩu của bạn là: <b>${account.id}</b>
                        <br>
                        Đăng nhập tại: <a href="https://admin.neoworks.vn/admin/auth" target="_blank">https://admin.neoworks.vn/admin/auth</a>
                    </div>
                </body>
                </html>`,
            })
            return res.status(200).json({
                message: "Account was existed, update role success",
            });
        }

        // Create account with email
        const accountId = uuidv4();
        const isCreateAccountSuccess =
            await accountServices.createAccountWithEmailService(
                accountId,
                email,
                "",
                ROLE
            );
        if (!isCreateAccountSuccess) {
            return next(createError(500));
        }

        // create profile
        const isCreateProfileSuccess = await createProfileWithAccountIdService(
            accountId,
            email
        );

        if (!isCreateProfileSuccess) {
            return next(createError(500));
        }

        // Send password to email
        sendEmailToUser({
            to: email,
            subject: "HCMUTE Job: Account Password",
            html: `<!DOCTYPE html>
            <html>
            <head>
                <title>HCMUTE Job: Account Password</title>
            </head>
            <body>
                <div>
                    Đăng ký thành công tài khoản admin cho email: <b>${email}</b>
                    <br>
                    Mât khẩu của bạn là: <b>${accountId}</b>
                    <br>
                    Đăng nhập tại: <a href="https://admin.neoworks.vn/admin/auth" target="_blank">https://admin.neoworks.vn/admin/auth</a>
                </div>
            </body>
            </html>`,
        })

        return res.status(201).json({
            code: 201,
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Admin sign up controller has error: ", error);
        return next(createError(500));
    }
};

export default adminSignUpController;
