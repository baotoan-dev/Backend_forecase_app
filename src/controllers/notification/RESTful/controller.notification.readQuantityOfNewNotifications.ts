import { Request, Response, NextFunction } from 'express';
import logging from '../../../utils/logging';
import createError from 'http-errors';
import * as notificationService from '../../../services/notification/_service.notification';

const readQuantityOfNewNotificationsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: accountId } = req.user;

        let result = await notificationService.readQuantityOfNewNotificationsService(accountId);

        if (!result) {
            return res.status(200).json({
                code: 200,
                success: true,
                message: "No notifications found",
                data: 0
            });
        }

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Read quantity of new notifications successfully",
            data: {
                total: parseInt(result)
            }
        });
    } catch (error) {
        logging.error(error);
        return next(createError(500, "Internal server error"));
    }
}

export default readQuantityOfNewNotificationsController;
