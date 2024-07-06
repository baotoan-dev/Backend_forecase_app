import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../utils/logging";
import { verifyRefreshTokenService } from "../../services/jwt/_service.jwt";
import redisClient from "../../configs/redis";

interface Payload {
    id: string;
    role: number;
}

const signOutController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Sign out controller start ...");
        // GET REFRESH TOKEN
        const refreshToken = req.body.refreshToken
            ? req.body.refreshToken.toString().trim()
            : "";
        if (!refreshToken) {
            logging.warning("Invalid refresh token");
            return next(createError(400));
        }

        // GET PAYLOAD FROM REFRESH TOKEN
        const payload: Payload | any = await verifyRefreshTokenService(
            refreshToken
        );

        if (payload === 1 || payload.id) {
            res.status(200).json({
                success: true,
                message: "Sign out success",
            });
        }
        const { id } = payload;
        if (payload && payload.id) {
            // REMOVE REFRESH TOKEN BY EMAIL IN REDIS SERVER
            // redisClient.del(id);
            const reply = await redisClient.get(id);

            let arrayRefreshToken = reply.split(",");

            let index = arrayRefreshToken.indexOf(refreshToken);

            arrayRefreshToken.splice(index, 1);

            redisClient.set(id, arrayRefreshToken.join(","));
        
        }

        return;

        // return res.status(200).json({
        //     success: true,
        //     message: "Sign out success",
        // });
    } catch (error) {
        logging.error("Sign out controller has error: ", error);
        if (error === "Token expired" || error === "Invalid token" || error === "Verify refresh token failure") {
            return res.status(200).json({
                success: true,
                message: "Sign out success",
            });
        } else if (error === "Get refresh token by email error") {
            return next(createError.InternalServerError());
        }
        return next(createError(500));
    }
};

export default signOutController;
