import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../utils/logging";
import * as accountServices from "../../services/account/_service.account";

const searchAccountsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Search all accounts controller start ...");
        // GET ROLE
        const { role: roleFromToken } = req.user;
        const searchPost = req.query.search ? req.query.search : ''

        if (roleFromToken !== 1) {
            logging.warning("Invalid role");
            return next(createError(406));
        }
        const role = +req.query.role;
        let accounts;
        if (role === 2) {
            // Read worker accounts
            accounts = await accountServices.searchWorkerAccounts(searchPost);
        } else {
            // READ ALL ACCOUNTS
            accounts = await accountServices.searchUserAccounts(searchPost);
            if (!accounts) {
                return next(createError(500));
            }
        }
        accounts = accounts.data;

        // SUCCESS
        return res.status(200).json({
            code: 200,
            // totalAccounts,
            success: true,
            data: accounts,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Read all accounts controller has error: ", error);
        return next(createError(500));
    }
};

export default searchAccountsController;
