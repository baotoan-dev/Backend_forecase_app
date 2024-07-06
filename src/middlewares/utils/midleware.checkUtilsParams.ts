import createHttpError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { isNumber } from '../../helpers/checkData/checkTypeOfData';

const checkLimitAndThresholdParams = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // This middleware is used to check limit and threshold params
    // limit and threshold from query are string type
    // limit is required
    // threshold is optional
    // But if threshold is provided, limit must be provided
    const { role  = 0 } = req.user || {};
    let { limit, threshold } = req.query;
    if (role === 0) {
        if (!limit) {
            return next(createHttpError(400, 'limit is required'));
        }
        if (!isNumber(limit)) {
            return next(createHttpError(400, 'limit must be number'));
        }
        if (Number(limit) < 0) {
            return next(createHttpError(400, 'limit must be greater than 0'));
        }
        if (Number(limit) > 20) {
            return next(createHttpError(400, 'limit must be less than 20'));
        }
    } else {
        limit = "999";
    }
    if (limit && threshold) {
        if (!isNumber(threshold)) {
            return next(createHttpError(400, 'threshold must be number'));
        }
        if (Number(threshold) < 0) {
            return next(createHttpError(400, 'threshold must be greater than 0'));
        }
    }
    next();
}

export { checkLimitAndThresholdParams };