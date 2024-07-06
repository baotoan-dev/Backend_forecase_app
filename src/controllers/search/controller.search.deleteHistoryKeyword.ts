import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import deleteHistorySearchService from "../../services/search/service.search.deleteHistorySearch";

const deleteHistoryKeywordController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => { 
    try {
        const { id: accountId } = req.user;

        const { keyword } = req.body;

        if (!keyword) {
            return next(createHttpError(400, "Bad request"));
        }

        // Call service
        // Delete keyword from database
        const isDeleteSuccess = await deleteHistorySearchService(accountId, keyword.toString());

        if (!isDeleteSuccess) {
            return next(createHttpError(500, "Internal server error"));
        }

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Delete keyword successfully",
            data: null,
        });
    }
    catch (error) {
        return next(createHttpError(500, "Internal server error"));
    }
};

export default deleteHistoryKeywordController;
