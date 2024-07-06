import { NextFunction, Request, Response } from "express";
import logging from "../../../../utils/logging";
import createHttpError from "http-errors";
import { KeywordNotificationEntity } from "../../../../models/notification/keyword/entity/keywordNotification.entity";
import readKeywordNotificationByAccountIdService from "../../../../services/notification/keyword/service.notification.keyword.read";
import readTypeOfNotificationPlatformService from "../../../../services/notification/keyword/service.readTypeOfNotificationPlatform";

const readKeywordNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: accountId } = req.user;

        const { lang = "vi" } = req.query;

        const data: KeywordNotificationEntity[] = [];

        const objects = await readKeywordNotificationByAccountIdService(accountId, lang as string);

        if (!objects) {
            return next(createHttpError(500, "Internal server error"));
        }

        objects.forEach((object: any) => {
            data.push(KeywordNotificationEntity.fromObject(object));
        });

        const response = data.map((item) => {
            return KeywordNotificationEntity.toResponse(item);
        });

        const typeOfPlatform = await readTypeOfNotificationPlatformService({accountId});

        return res.status(200).json({
            message: "Read keyword notification successfully",
            data: {
                type: typeOfPlatform[0]?.type,
                typeText: typeOfPlatform[0]?.type === 1 ? "Email" : "Mobile",
                status: {
                    emailStatus: typeOfPlatform[0]?.email_status,
                    pushStatus: typeOfPlatform[0]?.push_status,
                },
                keywords: response,
            },
            success: true,
        });

    } catch (error) {
        logging.error(`readKeywordNotification error: ${error}`);
        next(createHttpError(500, "Internal server error"))
    }
}

export default readKeywordNotification;