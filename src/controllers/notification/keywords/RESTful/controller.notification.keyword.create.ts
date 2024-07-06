import createHttpError from 'http-errors';
import createKeywordNotificationService from '../../../../services/notification/keyword/service.notification.keyword.create';
import { CreateKeywordNotificationDto } from '../../../../models/notification/keyword/dto/keyword-create.dto';
import { NextFunction, Request, Response } from "express";
import readTypeOfNotificationPlatformService from '../../../../services/notification/keyword/service.readTypeOfNotificationPlatform';
import createDefaultPlatformNotificationService from '../../../../services/notification/keyword/service.createDefaultPlatformForNotification';
import readKeywordNotificationByAccountIdService from '../../../../services/notification/keyword/service.notification.keyword.read';
import readFcmTokenService from '../../../../services/fcm-token/service.fcm-token.readByAccountId';
import readProfileByIdService from '../../../../services/profile/service.profile.readById';
import { DatabaseError } from '../../../../configs/database/database.error';
import { getError } from '../../../../common/language/error/database/create-keyword.language';

const createKeywordNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = CreateKeywordNotificationDto.fromRequest(req);

        if (!CreateKeywordNotificationDto.validate(dto)) {
            return next(createHttpError(400, 'Bad request'));
        }

        const limitKeyword = 10;

        const countKeyword = await readKeywordNotificationByAccountIdService(dto.accountId);

        if (countKeyword.length >= limitKeyword) {
            return next(createHttpError(413, `You can only create ${limitKeyword} keywords`));
        }

        const isCreateSuccess = await createKeywordNotificationService(dto);

        console.log('isCreateSuccess', isCreateSuccess);    

        if (!isCreateSuccess) {
            return next(createHttpError(500, 'Internal server error'));
        }

        const defaultPlatform = await readTypeOfNotificationPlatformService({accountId: dto.accountId});

        if (!defaultPlatform || defaultPlatform.length === 0) {
            const pushStatus = await readFcmTokenService(dto.accountId) ? 1 : 0;
            const profile = await readProfileByIdService('vi', dto.accountId);
            const emailStatus = profile.email ? 1 : 0;

            const isCreateDefaultPlatformSuccess = await createDefaultPlatformNotificationService(dto.accountId, pushStatus, emailStatus);

            console.log('isCreateDefaultPlatformSuccess', isCreateDefaultPlatformSuccess);

            if (!isCreateDefaultPlatformSuccess) {
                return next(createHttpError(500, 'Internal server error'));
            }
        }

        return res.status(201).json({
            message: 'Create keyword notification successfully',
            data: isCreateSuccess,
            success: true,
            code: 201
        });
    } catch (error) {
        if (error instanceof DatabaseError) {
            return next(createHttpError(400, getError(error, req['lang'])));
        }

        return next(createHttpError(500, 'Internal server error'));
    }
};

export default createKeywordNotification;