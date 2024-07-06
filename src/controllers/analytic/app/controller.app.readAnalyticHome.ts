import { NextFunction, Request, Response } from "express";
import logging from "../../../utils/logging";
import createError from "http-errors";
import countTotalApplyService from "../../../services/analytic/service.analytic.countTotalApply";

const readAnalyticHomeController = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(`Read analytic home controller start ...`);
    try {
        const totalApply = Number(await countTotalApplyService(req.user.id, 0));
        const totalSeen = Number(await countTotalApplyService(req.user.id, 1));
        const totalAccepted = Number(await countTotalApplyService(req.user.id, 2));
        const totalRejected = Number(await countTotalApplyService(req.user.id, 3));

        return res.status(200).json({
            status: 200,
            message: 'Read analytic home controller successfully',
            data: {
                totalApply,
                totalSeen,
                totalAccepted,
                totalRejected
            }
        });

    } catch (error) {
        logging.error(`Read analytic home controller has error: ${error}`);
        next(createError(500, 'Internal server error'));
    }
}


export default readAnalyticHomeController;