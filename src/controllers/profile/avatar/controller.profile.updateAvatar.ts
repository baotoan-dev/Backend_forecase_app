import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import logging from "../../../utils/logging";
import * as profileServices from "../../../services/profile/_service.profile";
import * as cloudinaryServices from "../../../services/cloudinary/_service.cloudinary";
import ImageBucket from "../../../models/enum/imageBucket.enum";

const updateAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Update avatar of profile controller start ...");

        // GET PROFILE ID
        const { id } = req.user;
        if (!id) {
            logging.warning("Invalid profile id");
            return next(createError(401));
        }

        if (req.files && req.files.length as number > 0) {
            const urlsUploaded = await cloudinaryServices.uploadImagesCloud(req.files, ImageBucket.AVATAR_IMAGES);
            if (!urlsUploaded || urlsUploaded.length === 0) {
                return next(createError(500));
            }

            // UPDATE AVATAR OF PROFILE
            const avatarUrl = urlsUploaded[0];
            const isUpdateAvatarSuccess = await profileServices.updateAvatar(
                id,
                avatarUrl
            );
            if (!isUpdateAvatarSuccess) {
                return next(createError(500));
            }

            // SUCCESS
            return res.status(200).json({
                code: 200,
                success: true,
                message: "Successfully",
            });
        }
        return next(createError(500));
    } catch (error) {
        logging.error("Update avatar of profile controller has error: ", error);
        return next(createError(500));
    }
};

export default updateAvatar;
