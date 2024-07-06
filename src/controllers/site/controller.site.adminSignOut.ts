import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../utils/logging";
import { verifyRefreshTokenService } from "../../services/jwt/_service.jwt";
import redisClient from "../../configs/redis";

interface Payload {
    id: string;
    role: number;
}

const admimSignOutController = async (
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

        if (payload && payload.id) {
            const { id, role } = payload;
            if (role === 1 || role === 2) {
                // REMOVE REFRESH TOKEN BY EMAIL IN REDIS SERVER
                redisClient.del(id);
            } else {
                return next(createError(401));
            }
        }
    } catch (error) {
        logging.error("Sign out controller has error: ", error);
        return next(createError(500));
    }
};

export default admimSignOutController;
