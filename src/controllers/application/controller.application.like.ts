import createError from 'http-errors';
import { Response, Request, NextFunction } from 'express';
import logging from '../../utils/logging';
import applicationService from '../../services/application/_service.application';

const updateLikeStatusApplicationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: applicationId, liked } = req.body;
        const { id: ownerId } = req.user;

        if (liked === undefined || liked === null) {
            return next(createError(400, 'Missing like value'));
        }

        if (liked !== 0 && liked !== 1 && liked !== 2) {
            return next(createError(400, 'Invalid like value, like value must be 0 or 1'));
        }

        if (!applicationId) {
            return next(createError(400, 'Missing application id'));
        }

        if (isNaN(+applicationId)) {
            return next(createError(400, 'Invalid application id'));
        }

        
        // CHECK IF APPLICATION EXISTS
        const postInformation = await applicationService.read.readPostInformationByApplicationById(+applicationId);
        
        if (!postInformation) {
            return next(createError(404, "Application not found"));
        }

        //CHECK VALID STATUS VALUE
        if (liked == 4 && postInformation.status !== 2 && postInformation.status !== 4) {
            return next(createError(400, "Invalid like, this application was not approved or accepted"));
        }

        // CHECK IF USER IS OWNER OF JOB
        if (postInformation.ownerId !== ownerId && req.user.role !== 1) {
            return next(createError(406, "You are not allowed to access this resource"));
        }

        if (+postInformation.liked === liked) {
            return res.status(200).json({
                code: 200,
                success: true,
                message: "Nothing to update",
            });
        }

        // UPDATE APPLICATION
        const isSuccessful = await applicationService.update.updateLikeStatus(+applicationId, +liked);

        if (!isSuccessful) {
            return next(createError(500, "Internal server error"));
        }


        // RETURN DATA
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Update application successfully",
        }); 
    }
    catch (error) {
        logging.error(error);
        next(createError(500, "Internal server error"));
    }
};

export default updateLikeStatusApplicationController;