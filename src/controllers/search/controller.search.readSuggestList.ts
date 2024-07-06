import { NextFunction, Request, Response } from "express";
import logging from "../../utils/logging";
import createHttpError from "http-errors";
import readSuggestedListSearchService from "../../services/search/service.search.readSuggestList";

const readSuggestedListSearchController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { limit = 10 } = req.query;

        if (isNaN(Number(limit)) || Number(limit) > 20 || Number(limit) < 1) {
            return next(createHttpError(400, "Limit must be number and between 1 and 20"));
        }

        // Read history search
        const listSuggestedListSearch = await readSuggestedListSearchService(
            +limit
        );

        return res.status(200).json({
            status_code: 200,
            data: listSuggestedListSearch,
            message: "Success"
        });

    } catch (error) {
        logging.error(error);
        return next(createHttpError(500, "Internal server error"));
    }
};

export default readSuggestedListSearchController;
