import { Request, Response, NextFunction } from 'express';
import logging from '../../utils/logging';
import createError from 'http-errors';
import applicationService from '../../services/application/_service.application';


const deleteApplicationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: ownerId, role } = req.user;
        const { id: applicationId } = req.params;

        // CHECK IF APPLICATION EXISTS
        const applicationInformation = await applicationService.read.readByAccountIdAdnApplicationId(+applicationId, +ownerId);

        if (!applicationInformation) {
            return next(createError(404, "Application not found"));
        }

        // CHECK IF USER IS OWNER OF JOB
        if (applicationInformation.ownerId !== ownerId && role !== 1) {
            return next(createError(406, "You are not allowed to access this resource"));
        }

        // DELETE APPLICATION
        await applicationService.delete.deleteCategoriesById(+applicationId);
        await applicationService.delete.deleteExperiencesById(+applicationId);
        await applicationService.delete.deleteEducationsById(+applicationId);
        await applicationService.delete.deleteLocationsById(+applicationId);
        await applicationService.delete.deleteById(+applicationId);
        
        // RETURN DATA
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Delete application successfully",
        });

    } catch (error) {
        logging.error(error);
        next(createError(500, "Internal server error"));
    }
}

export default deleteApplicationController;