import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import logging from "../../utils/logging";
import redisClient from "../../configs/redis";
import readAccountByIdService from "../../services/account/service.account.readAccountById";
import updateStatusAndRolesForAccountService from "../../services/account/service.account.updateStatusAndRole";


const disableController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Disable account controller has been called");
        // GET REFRESH TOKEN
        const email = req.body.email ? req.body.email.toString().trim() : "";
        const id = req.user.id;

        if (!email) {
            logging.warning("Invalid email");
            return next(createError(400));
        }

        if (!id) {
            logging.warning("Invalid profile id");
            return next(createError(401));
        }

        const data = await readAccountByIdService(id);

        if (!data) {
            logging.warning("Invalid profile id");
            return next(createError(401));
        }

        // Save email to redis
        redisClient.set(`disable:${id}`, id);

        
        const checkUpdate = await updateStatusAndRolesForAccountService(id, -1, 0);

        if (!checkUpdate) {
            logging.error("Disable account has error");
            return next(createError(500));
        }

        logging.info("Sign out controller has been executed successfully");

        return res.status(200).json({
            code: 200,
            message: "Disable account successfully",
        });
    } catch (error) {
        logging.error("Disable account has error", error);
        return next(createError(500));
    }
};

export default disableController;
