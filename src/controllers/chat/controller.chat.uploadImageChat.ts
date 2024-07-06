import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import logging from "../../utils/logging";
import * as chatServices from "../../services/chat/_service.chat";
import ImageBucket from "../../models/enum/imageBucket.enum";
import * as cloudinaryServices from "../../services/cloudinary/_service.cloudinary";

const uploadImageChatController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.user;
        if (!id) {
            logging.warning("Invalid profile id");
            return next(createError(401));
        }

        if (req.files && req.files.length as number > 0) {
            const urlsUploaded = await cloudinaryServices.uploadImagesCloud(
                req.files,
                ImageBucket.CHAT_IMAGES,
            );

            if (!urlsUploaded || urlsUploaded.length === 0) {
                return next(createError(500));
            }

            return res.status(200).json({
                code: 200,
                success: true,
                message: "Successfully",
                data: urlsUploaded,
            });
        }

    } catch (error) {
        logging.error("Upload image chat controller has error: ", error);
        return next(createError(500));
    }
};

export default uploadImageChatController;
