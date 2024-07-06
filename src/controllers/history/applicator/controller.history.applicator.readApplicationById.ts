import { Request, Response, NextFunction } from "express";
import logging from "../../../utils/logging";
import createError from "http-errors";
import applicationService from "../../../services/application/_service.application";
import ImageBucket from "../../../models/enum/imageBucket.enum";
import ProfilesBucket from "../../../models/enum/profileBucket.enum";

const readApplicationByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id: owner, role } = req.user;
        const { application_id: applicationId } = req.params;

        const postInformation =
            await applicationService.read.readPostInformationByApplicationById(
                +applicationId
            );

        if (!postInformation) {
            return next(createError(404, "Application not found"));
        }

        if (postInformation.account_id !== owner && role !== 1) {
            return next(
                createError(406, "You are not allowed to access this resource")
            );
        }

        // READ APPLICATION PROFILE ...
        const applicationProfile = await applicationService.read.readProfileById(
            req.query.lang.toString(),
            +applicationId
        );

        if (applicationProfile === null) {
            return next(createError(404, "Application profile not found"));
        }

        // FORMAT AVATAR
        applicationProfile.avatar = applicationProfile.avatar
            ? `${process.env.AWS_BUCKET_PREFIX_URL}/${ProfilesBucket.APPLICATION_BUCKET}/${applicationId}/` +
            applicationProfile.avatar
            : null;

        applicationProfile.cv_url = applicationProfile.cv_url
            ? `${process.env.AWS_BUCKET_PREFIX_URL}/${ProfilesBucket.APPLICATION_BUCKET}/${applicationId}/` +
            "/" + applicationProfile.cv_url
            : null;

        // READ APPLICATION CATEGORY
        const applicationCategories =
            await applicationService.read.readCategoriesById(
                req.query.lang.toString(),
                +applicationId
            );
        if (applicationCategories === null) {
            return next(createError(404, "Application categories not found"));
        }

        // READ APPLICATION EDUCATION
        const applicationEducations =
            await applicationService.read.readEducationsById(+applicationId);

        if (applicationEducations === null) {
            return next(createError(404, "Application education not found"));
        }

        // READ APPLICATION EXPERIENCE
        const applicationExperiences =
            await applicationService.read.readExperiencesById(+applicationId);
        if (applicationExperiences === null) {
            return next(createError(404, "Application experience not found"));
        }

        // READ APPLICATION LOCATION
        const applicationLocations =
            await applicationService.read.readLocationsById(
                req.query.lang.toString(),
                +applicationId
            );
        if (applicationLocations === null) {
            return next(createError(404, "Application location not found"));
        }

        applicationService.update.updateById(+applicationId, 1);

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Read application successfully",
            data: {
                applicationProfile,
                categories: applicationCategories,
                educations: applicationEducations,
                experiences: applicationExperiences,
                locations: applicationLocations,
            },
        });
    } catch (error) {
        logging.error(error);
        next(createError(500, "Internal server error"));
    }
};

export default readApplicationByIdController;
