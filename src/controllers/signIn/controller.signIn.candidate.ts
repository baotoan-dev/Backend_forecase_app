import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import signAccessTokenService from "../../services/jwt/service.jwt.signAccessToken";
import signRefreshTokenService from "../../services/jwt/service.jwt.signRefreshToken";
import logging from "../../utils/logging";
import * as accountServices from "../../services/account/_service.account";
import * as brypt from 'bcrypt'

const candidateSignInController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logging.info("Candidate sign in controller start ...")

    const email = req.body.email ? (req.body.email).trim() : "";
    const password = req.body.password ? req.body.password : "";

    if (!email) {
        return next(createError(400));
    }

    try {
        // check otp

        // GET ADMIN BY EMAIL
        const accountData = await accountServices.readAccountByEmailService(
            email,
        );

        if (!accountData) {
            return next(createError(404));
        }

        if (accountData.role !== 0 && accountData.role !== 1) {
            logging.error("Not user account");
            return next(createError(401));
        }

        if (brypt.compareSync(password, accountData.password) === false) {
            console.log('error password')
            return next(createError(404));
        }
        
        // SIGN ACCESS TOKEN AND REFRESH TOKEN
        const accessToken = await signAccessTokenService({
            id: accountData.id,
            role: accountData.role,
        });

        const refreshToken = await signRefreshTokenService({
            id: accountData.id,
            role: accountData.role,
        });

        res.status(200).json({
            code: 200,
            message: "Successfully",
            data: {
                accountId: accountData.id,
                role: accountData.role,
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });
    } catch (error) {
        logging.error("Candidate sign in controller start ...", error);
        next(createError(500));
    }
};

export default candidateSignInController;
