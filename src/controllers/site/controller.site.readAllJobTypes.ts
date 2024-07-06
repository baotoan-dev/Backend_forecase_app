import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import logging from "../../utils/logging";
import readAllJobTypesService from "../../services/jobTypes/service.jobTypes.readAll";

const readAllJobTypesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Read all job types controller start ...");

        // READ ALL SALARY TYPES
        const jobTypes = await readAllJobTypesService(req.query.lang as string);
        if (!jobTypes) {
            return next(createError(500));
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: jobTypes,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Read all salary types controller has error: ", error);
        return next(createError(500));
    }
};

export default readAllJobTypesController;
