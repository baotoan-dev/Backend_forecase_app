import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import { createProfileWithAccountIdService, readProfileByIdService } from "../../../services/profile/_service.profile";
import * as profileCategoryServices from "../../../services/profileCategory/_service.profileCategory";
import * as profileLocationServices from "../../../services/profileLocation/_service.profileLocation";
import * as profileEducationServices from "../../../services/profileEducation/_service.profileEducation";
import * as profileExperienceServices from "../../../services/profileExperience/_service.profileExperience";
import * as profileSocialServices from "../../../services/profileSocial/_service.profileSocial";
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

        // GET PROFILE BY ID
        let profileData = await readProfileByIdService(req.query.lang.toString(), id);
        if (!profileData) {
            logging.warning("Incorrect profile id");
            // create new profile
            const accountId = await readAccountByIdService(id);
            if (!accountId) {
                return next(createError(404));
            } else {
                const newProfile = await createProfileWithAccountIdService(id, "", "", "");
                if (!newProfile) {
                    return next(createError(500));
                }

                profileData = await readProfileByIdService(req.query.lang.toString(), id);
            }

        }

        profileData.name = profileData.name ? profileData.name : "Your name";

        profileData.address = {
            id: profileData.province_id ? profileData.province_id : null,
            name: profileData.address ? profileData.address : null,
        };

        profileData.birthday = profileData.birthday ? +profileData.birthday : 0;
   
        profileData.avatar = profileData.avatar
            ? `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.AVATAR_IMAGES}/` +
            profileData.avatar
            : null;

        profileData.cv_url = profileData.cv_url
            ? `${process.env.AWS_BUCKET_PREFIX_URL}/${ProfilesBucket.CV_BUCKET}/` + id + "/" + profileData.cv_url
            : null;

        delete profileData.province_id;

        // GET CATEGORIES OF PROFILE
        const categories = await profileCategoryServices.readAllByProfileId(
            req.query.lang.toString(),
            id
        );

        // GET LOCATIONS OF PROFILE
        const locations = await profileLocationServices.readAllByProfileId(req.query.lang.toString(), id);

        // GET EDUCATIONS OF PROFILE
        const educations = await profileEducationServices.readAllByProfileId(id);
        const educationsModified = educations.map((education) => ({
            ...education,
            start_date: +education.start_date,
            end_date: +education.end_date,
        }));

        // GET EXPERIENCES OF PROFILE
        const experiences = await profileExperienceServices.readAllByProfileId(id);
        const experiencesModified = experiences.map((experience) => ({
            ...experience,
            start_date: +experience.start_date,
            end_date: +experience.end_date,
        }));

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: {
                ...profileData,
                categories,
                locations,
                educations: educationsModified,
                experiences: experiencesModified,
                // socialLinks,
            },
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Read profile by id controller has error: ", error);
        return next(createError(500));
    }
};

export default readProfileByIdController;
