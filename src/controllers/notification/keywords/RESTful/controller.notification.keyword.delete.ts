import { DeleteKeywordNotificationDto } from '../../../../models/notification/keyword/dto/keyword-delete.dto';
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import logging from "../../../../utils/logging";
import deleteKeywordNotificationService from '../../../../services/notification/keyword/service.notification.keyword.delete';

const deleteKeywordNotificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {    
        const dto = DeleteKeywordNotificationDto.fromRequest(req);

        if (!DeleteKeywordNotificationDto.validate(dto)) {
            return next(createHttpError(400, 'Bad request'));
        }

        const isDeleteSuccess = await deleteKeywordNotificationService(dto);

        if (!isDeleteSuccess) {
            return next(createHttpError(500, 'Internal server error'));
        }

        return res.status(200).json({
            message: 'Delete keyword notification status successfully',
            data: null,
            success: true
        });
    } catch (error) {
        logging.error(error);
        return next(createHttpError(500, 'Internal server error'));
    }
};

export default deleteKeywordNotificationController;
