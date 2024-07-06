import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import signAccessTokenService from "../../services/jwt/service.jwt.signAccessToken";
import signRefreshTokenService from "../../services/jwt/service.jwt.signRefreshToken";
import logging from "../../utils/logging";
import * as accountServices from "../../services/account/_service.account";
import * as brypt from 'bcrypt'
import redisClient from "../../configs/redis";

const recruiterSignInController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logging.info("Recruiter sign in controller start ...")

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

        const idRedis = await redisClient.get(`disable:${accountData.id}`);

        if (idRedis === accountData.id) {
            return next(createError(401, "This account has been disabled"))
        }

        if (accountData.status === 0) {
            return next(createError(401));
        }

        // console.log(accountData);

        if (!accountData) {
            return next(createError(404));
        }

        if (accountData.role !== 3) {
            logging.error("Not recruiter account");
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
        logging.error("Recruiter sign in controller start ...", error);
        next(createError(500));
    }
};

export default recruiterSignInController;
