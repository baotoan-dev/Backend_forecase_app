import createError from 'http-errors';
import { Request, Response, NextFunction } from "express";
import logging from '../../utils/logging';
import readStatusAndAccountIdById from '../../services/post/service.post.readStatusAndAccountIdById';
import readProfileByIdService from '../../services/profile/service.profile.readById';
import applicationService from '../../services/application/_service.application';
import * as notificationService from '../../services/notification/_service.notification';
import createNewNotificationForApplication from '../notification/createNotificationContent/application/createForApplication.test';
import pushNotificationV2 from '../../services/pushNotification/push';
import * as cloudinaryServices from "../../services/cloudinary/_service.cloudinary";
import ProfilesBucket from '../../models/enum/profileBucket.enum';
import { multerUploadPdf } from '../../configs/multer';
import { readProfileCvByIdService } from '../../services/profile/_service.profile';
import axios from 'axios';

const createApplicationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        multerUploadPdf(req, res, async (err: any) => {
            // GET DATA
            const { postId, idCv, type } = req.body;

            const { id: accountId } = req.user;

            const files = req.file;

            console.log(postId, idCv, type, accountId, files)
            // REQUIRE DATA
            // BASIC INFORMATION 
            // BASIC CONTACT INFORMATION (PHONE NUMBER OR EMAIL)

            // CHECK POST STATUS
            const postStatusAndAccountId = await readStatusAndAccountIdById(+postId);

            if (!postStatusAndAccountId) {
                return next(createError(404, "Post not found"));
            }

            if (postStatusAndAccountId.status !== 1) {
                return next(createError(400, "Post is not available"));
            }

            if (postStatusAndAccountId.account_id === accountId) {
                return next(createError(400, "You can not apply for your own job"));
            }

            // CHECK INFORMATION OF USER BEFORE APPLY
            const userProfile = await readProfileByIdService("vi", accountId);


            if (!userProfile) {
                return next(createError(404, "User not found"));
            }


            // if (!userProfile.phone_number && !userProfile.email) {
            //     return next(createError(400, "You must have phone number or email to apply"));
            // }


            // if (!userProfile.name || !userProfile.address || !userProfile.birthday || userProfile.gender === null || userProfile.gender === undefined || !userProfile.province_id) {
            //     return next(createError(400, `You must have full information to apply. Please update your profile`));
            // }

            // CHECK IF ALREADY APPLIED 
            const application = await applicationService.read.readByPostIdAndAccountId(+postId, accountId);

            if (application) {
                return next(createError(400, "You have already applied for this job"));
            }

            let applicationId;

            if (type && type === "upload") {

                if (!files) {
                    return next(createError(400, "You must upload cv file"));
                }
                applicationId = await applicationService.create.createApplication(accountId, +postId, files.originalname + ".pdf");

                // CREATE APPLICATION

                if (!applicationId) {
                    return next(createError(500, "Create application failed"));
                }

                const urlsUploaded = await cloudinaryServices.uploadCVToCloudinaryService(
                    files,
                    files.originalname,
                    ProfilesBucket.APPLICATION_BUCKET,
                    parseInt(applicationId.insertId),
                    false
                ) as any;


                if (!urlsUploaded) {
                    return next(createError(500, "Upload cv file failed"));
                }
            }

            if (type && (type === 'near' || type === 'all')) {
                // upload cv from profile

                if (idCv) {

                    const cv = await readProfileCvByIdService(accountId);

                    let checkTrueCv = false;

                    cv.map((item) => {
                        if (+item.id === +idCv) {
                            checkTrueCv = true;
                        }
                    })

                    if (!checkTrueCv) {
                        return next(createError(400, "CV not found"));
                    }

                    const linkCv = process.env.AWS_BUCKET_PREFIX_URL + "/" + ProfilesBucket.CV_BUCKET + "/" + accountId + "/" + cv.filter((item) => +item.id === +idCv)[0].path;
                   
                    // download cv from linkCv and convert to files
                    const response = await axios.get(linkCv, {
                        responseType: 'arraybuffer'
                    });

                    applicationId = await applicationService.create.createApplication(accountId, +postId, cv.filter((item) => +item.id === +idCv)[0].path);

                    const urlsUploadedFromProfileCv = await cloudinaryServices.uploadCVToCloudinaryService(
                        response.data,
                        cv.filter((item) => +item.id === +idCv)[0].path,
                        ProfilesBucket.APPLICATION_BUCKET,
                        parseInt(applicationId?.insertId),
                        true
                    ) as any;

                    if (!urlsUploadedFromProfileCv) {
                        return next(createError(500, "Upload cv file failed"));
                    }
                }

                else {
                    return next(createError(400, "You must provide cv id"));
                }

            }

            // CONVERT FROM BIGINT TO NUMBER
            const applicationIdNumber = Number(applicationId.insertId);

            const applicationExperiences = await applicationService.create.createApplicationExperiences(applicationIdNumber, accountId);

            if (!applicationExperiences) {
                applicationService.delete.deleteById(applicationIdNumber);
                return next(createError(500, "Create application experiences failed"));
            }

            // CREATE APPLICATION EDUCATIONS
            const applicationEducations = await applicationService.create.createApplicationEducations(applicationIdNumber, accountId);

            if (!applicationEducations) {
                applicationService.delete.deleteById(applicationIdNumber);
                return next(createError(500, "Create application educations failed"));
            }

            // CREATE APPLICATION CATEGORY
            const applicationCategory = await applicationService.create.createApplicationCategories(applicationIdNumber, accountId);

            if (!applicationCategory) {
                applicationService.delete.deleteById(applicationIdNumber);
                return next(createError(500, "Create application category failed"));
            }

            // CREATE APPLICATION LOCATIONS
            const applicationLocations = await applicationService.create.createApplicationLocations(applicationIdNumber, accountId);

            if (!applicationLocations) {
                applicationService.delete.deleteById(applicationIdNumber);
                return next(createError(500, "Create application locations failed"));
            }


            // CREATE NOTIFICATION FOR RECRUITER

            // RETURN DATA
            res.status(201).json({
                code: 201,
                success: true,
                message: "Create application successfully"
            });

            const insertId = await notificationService.createNotificationService(
                postStatusAndAccountId.account_id,
                applicationIdNumber,
                0,
                1
            );

            if (!insertId) {
                return;
            }

            //for push notification

            const body = createNewNotificationForApplication(
                {
                    applicationId: applicationIdNumber,
                    postId: +postId,
                    type: 1,
                    applicationStatus: 0,
                    postTitle: postStatusAndAccountId.title,
                    companyName: postStatusAndAccountId.company_name,
                    name: userProfile.name,
                    notificationId: insertId,
                    lang: req.query.lang.toString(),
                    isRead: false
                }
            )

            pushNotificationV2(
                postStatusAndAccountId.account_id,
                body
            );

            // const content: NotificationContent = {
            //     application_id: applicationIdNumber,
            //     post_id: +postId,
            //     type: 1,
            //     applicationStatus: 0,
            //     postTitle: postStatusAndAccountId.title,
            //     companyName: postStatusAndAccountId.company_name,
            //     name: userProfile.name,
            //     notificationId: insertId
            // }

            // const notificationContent = createNotificationContent(
            //     req.query.lang.toString(),
            //     content
            // );

            // pushNotification(
            //     postStatusAndAccountId.account_id,
            //     notificationContent.title,
            //     notificationContent.body_push,
            //     // "",
            //     notificationContent.data
            // );

            return;
        }
        )
    } catch (error) {
        next(createError(500, 'Internal server error'));
    }

}

export default createApplicationController;