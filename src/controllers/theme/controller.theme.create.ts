import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

import logging from "../../utils/logging";
import * as cloudinaryServices from "../../services/cloudinary/_service.cloudinary";
import * as themeServices from "../../services/theme/_service.theme";
import * as themeLocationServices from "../../services/themeLocation/_service.themeLocation";
import ImageBucket from "../../models/enum/imageBucket.enum";

const createThemeController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Create theme controller start ...");
        const files = req.files;
        const title = req.body.title ? req.body.title.toString().trim() : null;
        const districtIds = req.body.districtIds ? req.body.districtIds : null;

        if (!title) {
            logging.warning("Invalid title");
            return next(createError(400));
        }

        let imageUrl: string;

        if (Array.isArray(files) && files && files.length > 0) {
            // UPLOAD FILE TO AWS AND CREATE BANNER
            // UPLOAD FILE TO AWS
            const urlsUploaded = await cloudinaryServices.uploadImagesCloud(files, ImageBucket.THEME_IMAGES);
            imageUrl =
                urlsUploaded && urlsUploaded.length > 0
                    ? urlsUploaded[0]
                    : null;
        } else {
            // ONLY CREATE BANNER
            imageUrl = req.body.imageUrl
                ? req.body.imageUrl.toString().trim().split("/").pop()
                : null;
        }

        if (!imageUrl) {
            logging.warning("Invalid image url");
            return next(createError(400));
        }

        // CREATE THEME
        const themeIdCreated = await themeServices.create(title, imageUrl);
        if (!themeIdCreated) {
            return next(createError(500));
        }

        // CREATE THEME DISTRICTS
        if (Array.isArray(districtIds) && districtIds.length > 0) {
            // let isValidDistrictId = false;
            // districtIds.forEach((districtId) => {
            //     if (!Number.isInteger(+districtId)) {
            //         isValidDistrictId = true;
            //         return;
            //     }
            // });
            // if (isValidDistrictId) {
            //     logging.warning("Invalid district id");
            //     return next(createError(400));
            // }

            const isCreateThemeLocationsSuccess =
                await themeLocationServices.create(themeIdCreated, districtIds);
            if (!isCreateThemeLocationsSuccess) {
                return next(createError(500));
            }
        }


        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: {
                id: themeIdCreated,
                image: `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.THEME_IMAGES}/${imageUrl}`,
                title,
                status: 1,
            },
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Create theme controller has error: ", error);
        return next(createError(500));
    }
};

export default createThemeController;
