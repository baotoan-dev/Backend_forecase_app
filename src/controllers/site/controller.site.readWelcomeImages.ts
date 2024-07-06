import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import logging from "../../utils/logging";
import readAllWelcomeImages from "../../services/welcomeImages/service.welcomeImages";
import ImageBucket from "../../models/enum/imageBucket.enum";

const readWellComeImagesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Read all welcome images controller start ...");

        // READ ALL SALARY TYPES
        const welcomeImages = await readAllWelcomeImages();
        if (!welcomeImages) {
            return next(createError(500));
        }

        welcomeImages.forEach((welcomeImage) => {
            welcomeImage.url = `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.WELCOME_IMAGES}/${welcomeImage.url}`;
        });

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: welcomeImages,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Read all welcome images controller has error: ", error);
        return next(createError(500));
    }
};

export default readWellComeImagesController;
