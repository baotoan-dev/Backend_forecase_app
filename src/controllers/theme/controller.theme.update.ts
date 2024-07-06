import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import logging from "../../utils/logging";
import * as themeServices from "../../services/theme/_service.theme";
import * as themeLocationServices from "../../services/themeLocation/_service.themeLocation";
import ImageBucket from "../../models/enum/imageBucket.enum";
import * as cloudinaryServices from "../../services/cloudinary/_service.cloudinary";

const updateThemeController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Update theme controller start ...");

        // GET BODY DATA
        const themeId = +req.body.id;
        const title = req.body.title ? req.body.title.toString().trim() : null;
        const districtIds = req.body.districtIds ? req.body.districtIds : null;

        // console.log(req.body);

        // VALIDATION
        if (!Number.isInteger(themeId)) {
            logging.warning("Invalid theme id");
            return next(createError(400));
        }

        if (!title) {
            logging.warning("Invalid body data");
            return next(createError(400));
        }

        let imageUrl: string;

        if (Array.isArray(req.files) && req.files && req.files.length > 0) {
            // UPLOAD FILE TO AWS
            const urlsUploaded = await cloudinaryServices.uploadImagesCloud(req.files, ImageBucket.THEME_IMAGES);
            imageUrl =
                urlsUploaded && urlsUploaded.length > 0
                    ? urlsUploaded[0]
                    : null;
        } else {
            imageUrl = req.body.imageUrl
                ? req.body.imageUrl.toString().trim().split("/").pop()
                : null;
        }

        if (!imageUrl) {
            logging.warning("Invalid image url");
            return next(createError(400));
        }

        // UPDATE THEME WITH IMAGE
        const isUpdateThemeWithImageSuccess = await themeServices.update(
            themeId,
            title,
            imageUrl,
            districtIds
        );
        if (!isUpdateThemeWithImageSuccess) {
            return next(createError(500));
        }

        // UPDATE THEME LOCATIONS
        if (Array.isArray(districtIds) && districtIds.length > 0) {
            // GET ALL THEME LOCATIONS
            const currentThemeLocationIds = (
                await themeLocationServices.getThemeLocations(themeId)
            ).map((location) => location.district_id);

            const themeLocationIdsWillBeCreated = [...districtIds];
            const themeLocationIdsWillBeDeleted = [];

            // FILTER
            currentThemeLocationIds.forEach((themeLocationId: string) => {
                if (districtIds.includes(themeLocationId)) {
                    // THIS LOCATION WILL BE KEEPED
                    themeLocationIdsWillBeCreated.splice(
                        themeLocationIdsWillBeCreated.indexOf(themeLocationId),
                        1
                    );
                } else {
                    // THIS LOCATION WILL BE DELETED
                    themeLocationIdsWillBeDeleted.push(themeLocationId);
                }
            });

            // MODIFY
            if (themeLocationIdsWillBeDeleted.length > 0) {
                // DELETE
                const isDeleteThemeLocationSuccess =
                    await themeLocationServices.delete(
                        themeId,
                        themeLocationIdsWillBeDeleted
                    );
                if (!isDeleteThemeLocationSuccess) {
                    return next(createError(500));
                }
            }

            if (themeLocationIdsWillBeCreated.length > 0) {
                // CREATE
                const isCreateThemeLocationsSuccess =
                    await themeLocationServices.create(
                        themeId,
                        themeLocationIdsWillBeCreated
                    );
                if (!isCreateThemeLocationsSuccess) {
                    return next(createError(500));
                }
            }
        } else {
            // DELETE THEME LOCATIONS
            await themeLocationServices.deleteAllThemeLocations(themeId);
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: {
                image: `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.THEME_IMAGES}/${imageUrl}`,
            },
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Update theme controller has error: ", error);
        return next(createError(500));
    }
};

export default updateThemeController;
