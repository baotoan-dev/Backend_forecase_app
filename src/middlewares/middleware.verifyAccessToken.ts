import jwt from "jsonwebtoken";
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../utils/logging";

interface Payload {
    id: string;
    role: number;
}

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    // GET HEADER AUTHORIZATION VALUE
    const headerAuthorization = req.headers.authorization;

    if (!headerAuthorization) {
        logging.warning("verify: Invalid header authorization");
        return next(createError(401));
    }

    // GET ACCESS TOKEN
    const accessToken = headerAuthorization.split("Bearer")[1]
        ? headerAuthorization.split("Bearer")[1].toString().trim()
        : null;

    if (!accessToken) {
        logging.warning("Invalid access token");
        return next(createError(401));
    }

    // VERIFY ACCESS TOKEN
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, payload: Payload) {
            if (err) {
                // EXPIRED ERROR
                if (err.name === "TokenExpiredError") {
                    logging.error("Token expired");
                    return next(createError(403));
                }

                // OTHER ERROR
                logging.error(err.message);
                return next(createError(401));
            }

            // VERIFY SUCCESS
            req.user = {
                id: payload.id,
                role: payload.role,
            };
            return next();
        }
    );
};

export default verifyAccessToken;
