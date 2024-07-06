import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../utils/logging";
import * as accountServices from "../../services/account/_service.account";

const searchTodayAccountsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Search today accounts controller start ...");

        let accounts;
        const searchPost = req.query.search ? req.query.search : ''


        // READ ALL ACCOUNTS
        accounts = await accountServices.searchTodayUserAccounts(searchPost);
        accounts = accounts.data;

        if (!accounts) {
            return next(createError(500));
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: accounts,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Search today accounts controller has error: ", error);
        return next(createError(500));
    }
};

export default searchTodayAccountsController;
