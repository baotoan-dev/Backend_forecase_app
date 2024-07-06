import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import * as postServices from "../../services/post/_service.post";
import logging from "../../utils/logging";

const countPostQuantityByAdminController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Count post quantity by account id controller start ... ");

        const isOwn = req.query.is_own;
        const aid = req.query.aid;
        let quatityPerDays, quantityPerMonths;

        // console.log(isOwn, aid);

        if (isOwn === "true") {
            if (!req.user || !req.user.id) {
                // console.log(req.user);
                return next(createError(401));
            }
            quatityPerDays =
                await postServices.countPostQuantityPerDayByAccountId(
                    req.user.id
                );

            quantityPerMonths =
                await postServices.countPostQuantityPerMonthByAccountId(
                    req.user.id
                );
        } else if (aid) {
            quatityPerDays =
                await postServices.countPostQuantityPerDayByAccountId(aid);

            quantityPerMonths =
                await postServices.countPostQuantityPerMonthByAccountId(aid);
        } else {
            return next(createError(400));
        }

        // console.log(quatityPerDays[quatityPerDays.length - 1])

        const newestDay = quatityPerDays[quatityPerDays.length - 1].date;
        

        let newestDayParts = newestDay.split("/");

        // month is 0-based, that's why we need dataParts[1] - 1
        let newestDayObject = new Date(+newestDayParts[2], newestDayParts[1] - 1, +newestDayParts[0]);
        // only return data from 30 days ago
        // newest day is newest day
        const newestDayDateTimestamp = newestDayObject.getTime();
        const thirtyDaysAgoDate = new Date(
            newestDayDateTimestamp - 30 * 24 * 60 * 60 * 1000
        );
        const thirtyDaysAgoDateTimestamp = thirtyDaysAgoDate.getTime();
        quatityPerDays = quatityPerDays.filter((item) => {
            const itemDateParts = item.date.split("/");
            const itemDateObject = new Date(+itemDateParts[2], itemDateParts[1] - 1, +itemDateParts[0]);
            const itemDateTimestamp = itemDateObject.getTime();
            return itemDateTimestamp >= thirtyDaysAgoDateTimestamp;            
        });

        return res.status(200).json({
            code: 200,
            success: true,
            data: {
                quatity_per_days: quatityPerDays.map((item) => ({
                    ...item,
                    quantity: Number(item.quantity),
                })),
                quantity_per_months: quantityPerMonths.map((item) => ({
                    ...item,
                    quantity: Number(item.quantity),
                })),
            },
            message: "Successfully",
        });
    } catch (error) {
        logging.error(
            "Count post quantity by account id controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default countPostQuantityByAdminController;
