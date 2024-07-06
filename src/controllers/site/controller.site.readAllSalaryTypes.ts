import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import logging from "../../utils/logging";
import * as salaryTypeServices from "../../services/salaryType/_service.salaryType";

const readAllSalaryTypes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Read all salary types controller start ...");

        // READ ALL SALARY TYPES
        const salaryTypes = await salaryTypeServices.readAllSalaryTypes(req.query.lang.toString());
        if (!salaryTypes) {
            return next(createError(500));
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: salaryTypes,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Read all salary types controller has error: ", error);
        return next(createError(500));
    }
};

export default readAllSalaryTypes;
