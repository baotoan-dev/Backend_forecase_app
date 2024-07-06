import { NextFunction, Request, Response } from "express";
import { UpdateKeywordNotificationStatusDto } from "../../../../models/notification/keyword/dto/keyword-update.dto";
import createHttpError from "http-errors";
import updateKeywordNotificationStatusService from "../../../../services/notification/keyword/service.notification.keyword.update";
import logging from "../../../../utils/logging";

const updateKeywordNotificationStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        logging.info('Calling update keyword notification status controller with params: ', req.body);
        
        const dto = UpdateKeywordNotificationStatusDto.fromRequest(req);
    
        if (!UpdateKeywordNotificationStatusDto.validate(dto)) {
            return next(createHttpError(400, 'Bad request'));
        }
    
        const isUpdateSuccess = await updateKeywordNotificationStatusService(dto);
    
        if (!isUpdateSuccess) {
            return next(createHttpError(500, 'Internal server error'));
        }
    
        return res.status(200).json({
            message: 'Update keyword notification status successfully',
            data: null,
            success: true
        });
    } catch (error) {
        logging.error(error);
        return next(createHttpError(500, 'Internal server error'));
    }
};

export default updateKeywordNotificationStatusController;
