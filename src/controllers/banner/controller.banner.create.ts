import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import logging from "../../utils/logging";
import * as bannerServices from "../../services/banner/_service.banner";
import * as cloudinaryServices from "../../services/cloudinary/_service.cloudinary";
import ImageBucket from "../../models/enum/imageBucket.enum";

const createBannerController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Create banner controller start ...");

        // GET BODY DATA
        const files = req.files;
        const redirectUrl = req.body.redirectUrl
            ? req.body.redirectUrl.toString().trim()
            : null;
        const type = +req.body.type;
        const version = +req.body.version;

        // VALIDATION
        if (!redirectUrl) {
            logging.warning("Invalid body data");
            return next(createError(400));
        }

        if (!Number.isInteger(type)) {
            logging.warning("Invalid type");
            return next(createError(400));
        }

        if (!Number.isInteger(version)) {
            logging.warning("Invalid version");
            return next(createError(400));
        }

        if (files && (files.length as number) > 0) {
            // UPLOAD FILE TO AWS AND CREATE BANNER
            // UPLOAD FILE TO AWS
            const urlsUploaded = await cloudinaryServices.uploadImagesCloud(
                files,
                ImageBucket.BANNER_IMAGES
            );
            let imageUrl =
                urlsUploaded && urlsUploaded.length > 0 ? urlsUploaded[0] : null;
            if (!imageUrl) {
                return next(createError(500));
            }

            // CREATE BANNER
            const bannerIdCreated = await bannerServices.create(
                imageUrl,
                redirectUrl,
                type,
                version
            );
            if (!bannerIdCreated) {
                return next(createError(500));
            }

            // SUCCESS
            return res.status(200).json({
                code: 200,
                success: true,
                data: {
                    id: bannerIdCreated,
                    image: `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.BANNER_IMAGES}/` + imageUrl,
                    redirect_url: redirectUrl,
                    type,
                    version,
                    status: 1,
                },
                message: "Successfully",
            });
        } else {
            // ONLY CREATE BANNER
            let imageUrl = req.body.imageUrl
                ? req.body.imageUrl.toString().trim()
                : null;
            if (!imageUrl) {
                logging.warning("Invalid image url");
                return next(createError(400));
            }

            if (!imageUrl.startsWith(process.env.AWS_BUCKET_PREFIX_URL)) {
                return next(createError(400, "Please upload image to AWS S3"));
            }
            
            imageUrl = imageUrl.split("/").pop();

            // CREATE BANNER
            const bannerIdCreated = await bannerServices.create(
                imageUrl,
                redirectUrl,
                type,
                version
            );
            if (!bannerIdCreated) {
                return next(createError(500));
            }

            // SUCCESS
            return res.status(200).json({
                code: 200,
                success: true,
                data: {
                    id: bannerIdCreated,
                    image: `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.BANNER_IMAGES}/` + imageUrl,
                    redirect_url: redirectUrl,
                    type,
                    version,
                    status: 1,
                },
                message: "Successfully",
            });
        }
    } catch (error) {
        logging.error("Create banner controller has error: ", error);
        return next(createError(500));
    }
};

export default createBannerController;
