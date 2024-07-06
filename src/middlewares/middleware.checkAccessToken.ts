import jwt from "jsonwebtoken";
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../utils/logging";

interface Payload {
    id: string;
    role: number;
}

// This middleware is used to check if the user has an access token or not
// If the user has an access token, the user will be assigned to req.user
// If the user does not have an access token, req.user will be null

// Note: This middleware is not like verifyAccessToken middleware

// It is used in the following routes:
// - /api/v1/search

const checkAccessToken = (req: Request, res: Response, next: NextFunction) => {
    // GET HEADER AUTHORIZATION VALUE
    const headerAuthorization = req.headers.authorization;

    if (!headerAuthorization) {
        req.user = {
            id: null,
            role: null,
        };
        return next();
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

export default checkAccessToken;
