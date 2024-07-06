import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import fetch from 'node-fetch';
import logging from "../../utils/logging";
import { multerUploadImages } from "../../configs/multer";
import * as postServices from "../../services/post/_service.post";
import * as postImageServices from "../../services/postImage/_service.postImage";
import * as postCategoryServices from "../../services/postCategory/_service.postCategory";
import Helper from "../../helpers/helper.class";
import ImageBucket from "../../models/enum/imageBucket.enum";
import countPostQuantityByDayByAccountId from "../../services/post/service.post.countPostQuantityByDayByAccountId";
import createPostResourceService from "../../services/postResource/service.postResource.create";
import createNotificationKeywordForUsers from "../notification/keywords/createNotification/createNotificationForKeyword";
import * as cloudinaryServices from "../../services/cloudinary/_service.cloudinary";
import readProvinceAndDistrictByWardIdService from "../../services/location/service.location.readProvinceAndDistrictByWardId";
const createPostController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Create post controller start ...");
        multerUploadImages(req, res, async (err) => {
            if (err) {
                logging.error("Multer error");
                return next(createError(400, err.message));
            }

            if (!req.user && !req.user.id) {
                return next(401);
            }

            // GET ROLE OF USER
            const { role } = req.user;

            if (role === 0) {
                // CHECK LIMITATION OF POST QUANTITY
                const postQuantity = await countPostQuantityByDayByAccountId(
                    req.user.id
                );

                if (parseInt(postQuantity[0].quantity) >= 10 && role === 0) {
                    logging.warning("Post quantity limit");
                    return next(createError(400, "You only can post 10 job/day"));
                }
            }

            // GET DATA
            const accessToken = 'pk.eyJ1IjoiaGJ0b2FuIiwiYSI6ImNsd29tc2h2NjFhOTEyaW54MmFnYWt3ZDQifQ.ljik1w_nZErIaDyhwXh68w';

            const accountId = req.user.id;
            const title = req.body.title
                ? req.body.title.toString().trim()
                : null;
            const companyName = req.body.companyName
                ? req.body.companyName.toString().trim()
                : null;
            const wardId = req.body.wardId;
            const address = req.body.address;
            let latitude = req.body.latitude;
            let longitude = req.body.longitude;
            const isDatePeriod = +req.body.isDatePeriod;
            const isWorkingWeekend = +req.body.isWorkingWeekend;
            const isRemotely = +req.body.isRemotely;
            const startDate = Number.isInteger(+req.body.startDate)
                ? +req.body.startDate
                : null;
            const endDate = Number.isInteger(+req.body.endDate)
                ? +req.body.endDate
                : null;
            const startTime = +req.body.startTime;
            const endTime = +req.body.endTime;
            const salaryMin = +req.body.salaryMin || 0;
            const salaryMax = +req.body.salaryMax || 0;
            const salaryType = +req.body.salaryType;
            const description = req.body.description
                ? req.body.description.toString().trim()
                : null;
            const categoryIds = req.body.categoryIds
                ? typeof req.body.categoryIds === "string"
                    ? [req.body.categoryIds]
                    : req.body.categoryIds
                : null;

            let phoneNumber = req.body.phoneNumber
                ? req.body.phoneNumber
                : null;
            let moneyType = req.body.moneyType ? +req.body.moneyType : null;

            const siteUrl = req.body.url ? req.body.url : null;
            
            const email = req.body.email ? req.body.email : "";
            
            const companyResourceId = req.body.companyResourceId ? req.body.companyResourceId : null;
            
            const jobTypeId = req.body.jobTypeId ? req.body.jobTypeId : null;
            
            const expiredDate = Number.isInteger(+req.body.expiredDate) ? +req.body.expiredDate : null;
            //

            // VALIDATION
            if (!title || !companyName) {
                logging.warning("Invalid body data");
                return next(createError(400, "Invalid body data"));
            }

            if (!address || !address.toString().trim()) {
                logging.warning("Invalid address value");
                return next(createError(400, "Invalid address value"));
            }

            if (
                parseFloat(latitude) < 8.0 ||
                parseFloat(latitude) > 23.0 ||
                !parseFloat(latitude)
            ) {
                logging.warning("Invalid latitude value");
                return next(createError(400, "Invalid latitude value"));
            }

            if (
                parseFloat(longitude) < 102.0 ||
                parseFloat(longitude) > 109.0 ||
                !parseFloat(longitude)
            ) {
                logging.warning("Invalid longitude value");
                return next(createError(400, "Invalid longitude value"));
            }

            if (
                !Number.isInteger(isDatePeriod) ||
                isDatePeriod < 0 ||
                isDatePeriod > 1
            ) {
                logging.warning("Invalid isDatePeriod value");
                return next(createError(400, "Invalid isDatePeriod value"));
            }

            if (
                isDatePeriod === 1 &&
                (new Date(startDate).toString() === "Invalid Date" ||
                    new Date(startTime).toString() === "Invalid Date" ||
                    new Date(startDate) > new Date(endDate))
            ) {
                logging.warning("Invalid date value");
                return next(createError(400, "Invalid date value"));
            }

            if (
                !Number.isInteger(isWorkingWeekend) ||
                isWorkingWeekend < 0 ||
                isWorkingWeekend > 1
            ) {
                logging.warning("Invalid isWorkingWeekend value");
                return next(createError(400, "Invalid isWorkingWeekend value"));
            }

            if (
                !Number.isInteger(isRemotely) ||
                (isRemotely !== 0 && isRemotely !== 1)
            ) {
                logging.warning("Invalid isRemotely value");
                return next(createError(400, "Invalid isRemotely value"));
            }

            if (
                new Date(startTime).toString() === "Invalid Date" ||
                new Date(endTime).toString() === "Invalid Date"
            ) {
                logging.warning("Invalid time value");
                return next(createError(400, "Invalid time value"));
            }

            if (
                startTime < 57600000 ||
                endTime < 57600000 ||
                startTime > 144000000 ||
                endTime > 144000000
            ) {
                logging.warning("Invalid time value");
                return next(createError(400, "Invalid time value"));
            }

            if (!Number.isInteger(salaryMin) || salaryMin < 0) {
                logging.warning("Invalid salary value");
                return next(createError(400, "Salary must be greater than 0"));
            }

            if (!Number.isInteger(salaryMax) || salaryMax < 0) {
                logging.warning("Invalid salary value");
                return next(createError(400, "Salary must be greater than 0"));
            }

            if (salaryMin > salaryMax) {
                logging.warning("Invalid salary value");
                return next(
                    createError(400, "Salary min must be less than salary max")
                );
            }

            if (!Number.isInteger(salaryType) || salaryType <= 0) {
                logging.warning("Invalid salaryType value");
                return next(createError(400, "Invalid salaryType value"));
            }

            //HELPER
            const helper = new Helper();

            if (phoneNumber && !helper.checkPhoneNumberFormat(phoneNumber)) {
                return next(
                    createError(
                        400,
                        "Please enter a valid Vietnamese phone number"
                    )
                );
            }

            if (email && !helper.checkEmailFormat(email)) {
                logging.warning("Invalid email format");
                return next(createError(400, "Please enter a valid email"));
            }

            if (!moneyType) {
                logging.warning("Invalid money type");
                return next(createError(400, "Type of money is required"));
            }

            if (moneyType !== 1 && moneyType !== 2) {
                logging.warning("Invalid money type");
                return next(
                    createError(
                        400,
                        "Invalid money type, only 1 (VND) or 2 (USD)"
                    )
                );
            }

            if (!description) {
                logging.warning("Invalid description");
                return next(createError(400, "Description is required"));
            }
            if (description.length > 4000) {
                logging.warning("Invalid description");
                return next(
                    createError(
                        400,
                        "Description must be less than 4000 characters"
                    )
                );
            }

            if (!categoryIds) {
                logging.warning("Invalid categoryIds");
                return next(createError(400, "CategoryIds is required"));
            }

            let isValidCategoryId = true;
            // console.log(categoryIds);
            if (categoryIds.length > 2) {
                return next(createError(400, "Maximum 2 categories"));
            }
            categoryIds.forEach((categoryId) => {
                if (!Number.isInteger(+categoryId)) {
                    isValidCategoryId = false;
                    return;
                }
            });
            if (!isValidCategoryId) {
                return next(createError(400, "Invalid categoryIds"));
            }


            // CHECK IF JOB TYPE ID IS VALID
            // NOTE: JOB TYPE ID IS OPTIONAL
            if (jobTypeId && !Number.isInteger(+jobTypeId)) {
                logging.warning("Invalid jobTypeId");
                return next(createError(400, "Invalid jobTypeId"));
            }


            // CHECK IF COMPANY RESOURCE ID IS VALID
            // NOTE: COMPANY RESOURCE ID IS OPTIONAL
            if (companyResourceId && !Number.isInteger(+companyResourceId)) {
                logging.warning("Invalid companyResourceId");
                return next(createError(400, "Invalid companyResourceId"));
            }

            let newExpireDate = null;

            if (expiredDate) {
                if (new Date(expiredDate).toString() === "Invalid Date") {
                    logging.warning("Invalid expiredDate");
                    return next(createError(400, "Invalid expiredDate"));
                } else {
                    newExpireDate = new Date(expiredDate);
                }
            }

            const dataWard = await readProvinceAndDistrictByWardIdService(wardId)
            const nameWard = dataWard.ward_name;
            const nameDistrict = dataWard.district_name;
            const nameProvince = dataWard.province_name;
            const addForMapbox = `${address}, ${nameWard}, ${nameDistrict}, ${nameProvince}, Vietnam`
            const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${addForMapbox}/forward.json?access_token=${accessToken}`);

            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.features.length > 0) {
                        const newLatitude = data.features[0].center[1];
                        const newLongitude = data.features[0].center[0];
                        latitude = newLatitude;
                        longitude = newLongitude;
                        console.log(latitude, longitude);
                    }
                })
                .catch(err => {
                    console.log(err);
                });

            // HANDLE CREATE
            const postIdCreated = await postServices.createPost(
                accountId,
                title,
                companyName,
                wardId,
                address.toString().trim(),
                parseFloat(latitude),
                parseFloat(longitude),
                isDatePeriod,
                isWorkingWeekend,
                isRemotely,
                startDate,
                endDate,
                startTime,
                endTime,
                salaryMin,
                salaryMax,
                salaryType,
                description.toString().trim(),
                helper.formatPhoneNumber(phoneNumber),
                moneyType,
                role,
                +jobTypeId,
                email.toString().trim(),
                newExpireDate
            );
            if (!postIdCreated) {
                return next(createError(500));
            }

            // CREATE CATEGORIES OF POST
            const isCreateCategoriesOfPostSuccess =
                await postCategoryServices.create(postIdCreated, categoryIds);
            if (!isCreateCategoriesOfPostSuccess) {
                return next(createError(500));
            }

            if (req.files && req.files.length as number > 0) {
                // UPLOAD IMAGES TO AWS
                const urlsUploaded = await cloudinaryServices.uploadImagesCloud(req.files, ImageBucket.POST_IMAGES, postIdCreated);

                // CREATE IMAGES OF POST
                if (urlsUploaded && urlsUploaded.length > 0) {
                    const isCreateImagesOfPostSuccess =
                        await postImageServices.create(
                            postIdCreated,
                            urlsUploaded
                        );
                    if (!isCreateImagesOfPostSuccess) {
                        return next(createError(500));
                    }
                }
            }

            // CREATE POST RESOURCE
            if (companyResourceId && siteUrl && (role === 2 || role === 1)) {
                const isCreatePostResourceSuccess =
                    await createPostResourceService(
                        postIdCreated,
                        siteUrl,
                        +companyResourceId,
                    );
                if (!isCreatePostResourceSuccess) {
                    return next(createError(500));
                }
            } else {
                const isCreatePostResourceSuccess =
                    await createPostResourceService(
                        postIdCreated,
                        "",
                        2,
                    );
                if (!isCreatePostResourceSuccess) {
                    return next(createError(500));
                }
            }

            // SUCCESS
            res.status(200).json({
                code: 200,
                success: true,
                data: {
                    postId: postIdCreated,
                },
                message: "Successfully",
            });


            // CREATE NOTIFICATION KEYWORD FOR USERS
            createNotificationKeywordForUsers(
                {
                    postTitle: title,
                    postId: postIdCreated,
                    wardId: wardId,
                    categoryId: categoryIds,
                    accountId: accountId,
                }
            )
        });
    } catch (error) {
        logging.error("Create post controller has error: ", error);
        return next(createError(500));
    }
};

export default createPostController;