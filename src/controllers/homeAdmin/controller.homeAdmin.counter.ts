import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import logging from "../../utils/logging";
import * as postServices from "../../services/post/_service.post";
import * as accountServices from "../../services/account/_service.account";
import * as companyServices from "../../services/company/_service.company";

const counterController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const year = req.query.year;
        // COUNT TOTAL POST QUANTITY
        const totalPostQuantity = await postServices.countTotalPostQuantity();
        if (!totalPostQuantity) {
            return next(createError(500));
        }

        // COUNT TOTAL ACCOUNT QUANTITY
        const totalAccountQuantity =
            await accountServices.countTotalAccountQuantity();
        if (!totalAccountQuantity) {
            return next(createError(500));
        }

        // COUNT TODAY POST
        const todayPostQuantity = await postServices.countTodayPostQuantity();
        if (!todayPostQuantity) {
            return next(createError(500));
        }

        // COUNT TODAY ACCOUNT
        const todayAccountQuantity =
            await accountServices.countTodayAccountQuantity();
        if (!todayAccountQuantity) {
            return next(createError(500));
        }

        // COUNT TOTAL PENDING POST QUANTITY
        const totalPendingPostQuantity =
            await postServices.countTotalPendingPostQuantity();
        if (!totalPendingPostQuantity) {
            return next(createError(500));
        }

        // COUNT TODAY PENDING POST QUANTITY
        const todayPendingPostQuantity =
            await postServices.countTodayPendingPostQuantity();
        if (!todayPendingPostQuantity) {
            return next(createError(500));
        }

        // COUNT POST QUANTITY PER MONTH
        const postQuantityPerMonth =
            await postServices.countPostQuantityPerMonth();
        if (!postQuantityPerMonth) {
            return next(createError(500));
        }

        // COUNT ACCOUNT QUANTITY PER MONTH
        const accountQuantityPerMonth =
            await accountServices.countAccountQuantityPerMonth();
        if (!accountQuantityPerMonth) {
            return next(createError(500));
        }

        // COUNT POST QUANTITY PER STATUS
        const postQuantityPerStatus =
            await postServices.countPostQuantityPerStatus();
        if (!postQuantityPerStatus) {
            return next(createError(500));
        }

        const companyQuantityPerMonth = 
            await companyServices.countCompanyOfMonthService(+year ? +year : new Date().getFullYear());
        if (!companyQuantityPerMonth) {
            return next(createError(500));
        }

        return res.status(200).json({
            code: 200,
            success: true,
            data: {
                total_post: Number(totalPostQuantity.quantity),
                total_account: Number(totalAccountQuantity.quantity),
                today_post: Number(todayPostQuantity.quantity),
                today_account: Number(todayAccountQuantity.quantity),
                total_pending_post: Number(totalPendingPostQuantity.quantity),
                today_pending_post: Number(todayPendingPostQuantity.quantity),
                post_per_month: postQuantityPerMonth.map((item) => ({
                    ...item,
                    quantity: Number(item.quantity),
                })),
                account_per_month: accountQuantityPerMonth.map((item) => ({
                    ...item,
                    quantity: Number(item.quantity),
                })),
                company_per_month: companyQuantityPerMonth,              
                post_per_status: postQuantityPerStatus.map((item) => {
                    let statusValue = "";
                    switch (item.status) {
                        case 0:
                            statusValue = "pending";
                            break;
                        case 1:
                            statusValue = "accepted";
                            break;
                        case 2:
                            statusValue = "rejected";
                            break;
                        case 3:
                            statusValue = "closed";
                            break;
                    }
                    return {
                        ...item,
                        quantity: Number(item.quantity),
                        status_value: statusValue,
                    };
                }),
            },
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Count home admin page error: ", error);
        return next(createError(500));
    }
};

export default counterController;
