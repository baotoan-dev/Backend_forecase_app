import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import logging from "../../../utils/logging";
import { createProfileWithAccountIdService, readProfileByIdService } from "../../../services/profile/_service.profile";
import ImageBucket from "../../../models/enum/imageBucket.enum";
import ProfilesBucket from "../../../models/enum/profileBucket.enum";
import readAccountByIdService from "../../../services/account/service.account.readAccountById";

const readProfileByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Read profile by id controller start ...");

        const { lang = "vi" } = req.query;

        if (lang !== "vi" && lang !== "en" && lang !== "ko") {
            logging.warning("Invalid lang");
            return next(createError(400));
        }

        // GET PROFILE ID
        const id = req.query.id
            ? req.query.id.toString().trim()
            : req.user.id.toString().trim();

        if (!id) {
            logging.warning("Invalid profile id");
            return next(createError(400));
        }

        let profileData = await readProfileByIdService(req.query.lang.toString(), id);

        profileData.name = profileData.name ? profileData.name : "Your name";
   
        profileData.avatar = profileData.avatar
            ? `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.AVATAR_IMAGES}/` +
            profileData.avatar
            : null;

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: {
                ...profileData
            },
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Read profile by id controller has error: ", error);
        return next(createError(500));
    }
};

export default readProfileByIdController;
