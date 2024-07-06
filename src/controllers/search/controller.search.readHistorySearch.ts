import { NextFunction, Request, Response } from "express";
import logging from "../../utils/logging";
import createHttpError from "http-errors";
import readHistorySearchByAccountIdService from "../../services/search/service.search.readHistorySearch";

const readHistorySearchByAccountIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        const { id: accountId } = req.user;

        const { limit = 10, page = 0 } = req.query;

        // limit is number, max is 20, min is 1
        if (isNaN(Number(limit)) || Number(limit) > 20 || Number(limit) < 1) {
            return next(createHttpError(400, "Limit must be number and between 1 and 20"));
        }

        if (isNaN(Number(page)) || Number(page) < 0) {
            return next(createHttpError(400, "Page must be number and greater than 0"));
        }
        // page is number, min is 0


        // Read history search
        const listHistorySearch = await readHistorySearchByAccountIdService(
            accountId,
            +limit,
            +page
        );

        return res.status(200).json({
            status_code: 200,
            data: {
                listHistorySearch,
                is_over: listHistorySearch.length < +limit ? true : false
            },
            message: "Success"
        });


    } catch (error) {
        logging.error(error);
        return next(createHttpError(500, "Internal server error"));
    }
};

export default readHistorySearchByAccountIdController;