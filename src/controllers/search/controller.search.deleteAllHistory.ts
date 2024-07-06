import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import deleteAllHistorySearchService from "../../services/search/service.search.deleteAllHistory";

const deleteAllHistoryKeywordController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => { 
    try {
        const { id: accountId } = req.user;
        // Call service
        // Delete keyword from database
        const isDeleteSuccess = await deleteAllHistorySearchService(accountId);

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

export default deleteAllHistoryKeywordController;
