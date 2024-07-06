import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import logging from "../utils/logging";
import jwt from "jsonwebtoken";
import readActiveAccountByEmailService from "../services/account/service.account.readActiveOfAccount";

interface Payload {
  id: string;
  role: number;
}

const checkIsActiveCompanyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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
    async function (err, payload: Payload) {
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

      try {
        const dataAccount = await readActiveAccountByEmailService(req.user.id);
        if (!dataAccount.is_active) {
          logging.warning("Account not active");
          return next(createError(403, "Account not active"));
        }
        return next();
      } catch (error) {
        logging.error("Error fetching account data: " + error.message);
        return next(createError(500));
      }
    }
  );
};

export default checkIsActiveCompanyMiddleware;
