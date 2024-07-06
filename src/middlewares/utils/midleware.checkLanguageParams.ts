import createHttpError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { isNumber } from '../../helpers/checkData/checkTypeOfData';

const checkLanguageParams = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { lang } = req.query;
    if (!lang) {
        req.query.lang = "vi";
        return next();
    }
    if (lang !== "vi" && lang !== "en" && lang !== "ko") {
        return next(createHttpError(400, 'lang must be vi, en or ko'));
    }
    next();
}

export { checkLanguageParams };