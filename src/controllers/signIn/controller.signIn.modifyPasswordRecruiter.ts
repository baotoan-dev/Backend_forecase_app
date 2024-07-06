import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import signAccessTokenService from "../../services/jwt/service.jwt.signAccessToken";
import signRefreshTokenService from "../../services/jwt/service.jwt.signRefreshToken";
import logging from "../../utils/logging";
import * as accountServices from "../../services/account/_service.account";
import * as bcrypt from 'bcrypt';

const modifyPasswordRecruiterController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logging.info("Modify password recruiter controller start ...");

    const { id: accountId } = req.user; // Ensure `req.user` is populated by some auth middleware
    const { oldPassword, newPassword } = req.body;

    console.log('values', accountId, oldPassword, newPassword);

    try {
        // Check if required fields are present
        if (!accountId || !oldPassword || !newPassword) {
            return next(createError(400, "Missing required fields"));
        }

        // Fetch user data by account ID
        const dataUser = await accountServices.readAccountByIdService(accountId);

        if (!dataUser) {
            return res.status(404).json({
                code: 404,
                message: "User not found",
            });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, dataUser.password);

        if (!isMatch) {
            return res.status(400).json({
                code: 400,
                message: "Old password is incorrect",
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        const updatePasswordSuccess = await accountServices.updatePasswordForAccountService(accountId, hashedPassword);

        if (!updatePasswordSuccess) {
            return res.status(500).json({
                code: 500,
                message: "Update password failed",
            });
        }

        // Generate new tokens
        const accessToken = await signAccessTokenService({
            id: accountId,
            role: dataUser.role,
        });

        const refreshToken = await signRefreshTokenService({
            id: accountId,
            role: dataUser.role
        });

        // Respond with success and new tokens
        return res.status(200).json({
            code: 200,
            message: "Password updated successfully",
            accessToken,
            refreshToken,
        });
    } catch (error) {
        logging.error(`Error at modify password recruiter controller: ${error}`);
        return next(createError(500, "Internal Server Error"));
    }
};

export default modifyPasswordRecruiterController;
