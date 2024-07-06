import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../utils/logging";
import { multerUploadImages } from "../../configs/multer";
import * as postServices from "../../services/post/_service.post";
import * as postImageServices from "../../services/postImage/_service.postImage";
import * as postCategoryServices from "../../services/postCategory/_service.postCategory";
import Helper from "../../helpers/helper.class";
import ImageBucket from "../../models/enum/imageBucket.enum";
import * as cloudinaryService from "../../services/cloudinary/_service.cloudinary";

const updatePostInformationController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Update post information controller start ...");
        multerUploadImages(req, res, async (err) => {
            if (err) {
                logging.error("Multer error");
                return next(createError(400, "You can only upload 5 images"));
            }

            // UPLOAD IMAGES TO AWS
            const postId = +req.body.id;

            if (!Number.isInteger(postId) || postId <= 0) {
                logging.error("Invalid post id");
                return next(createError(400));
            }

            const post = await postServices.readPostById(postId);
            
            if (!post) {
                logging.error("Post not found");
                return next(createError(404));
            }

            if (post[0].account_id !== req.user.id) {
                return next(createError(406, "You can not update this post"));
            }
            // GET BODY DATA
            const title = req.body.title ? req.body.title.toString().trim() : null;
            const companyName = req.body.companyName
                ? req.body.companyName.toString().trim()
                : null;
            const wardId = req.body.wardId;
            const address = req.body.address;
            const latitude = req.body.latitude;
            const longitude = req.body.longitude;
            const isDatePeriod = +req.body.isDatePeriod;
            const isWorkingWeekend = +req.body.isWorkingWeekend;
            const isRemotely = +req.body.isRemotely;
            const startDate = req.body.startDate ? +req.body.startDate : null;
            const endDate = req.body.endDate ? +req.body.endDate : null;
            const startTime = +req.body.startTime;
            const endTime = +req.body.endTime;
            const salaryMin = +req.body.salaryMin;
            const salaryMax = +req.body.salaryMax;
            const salaryType = +req.body.salaryType;
            const description = req.body.description
                ? req.body.description.toString().trim()
                : null;
            const categoryIds = req.body.categoryIds
                ? typeof req.body.categoryIds === "string"
                    ? [req.body.categoryIds]
                    : req.body.categoryIds
                : null;
            let deletedImages = req.body.deletedImages
                ? req.body.deletedImages
                : null;
            let phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : null;
            let moneyType = req.body.moneyType ? +req.body.moneyType : null;
            let email = req.body.email ? req.body.email : "";
            const expiredDate = Number.isInteger(+req.body.expiredDate) ? +req.body.expiredDate : null;
            let jobTypeId = req.body.jobTypeId ? +req.body.jobTypeId : null;

            // PARSE DATA
            if (Array.isArray(deletedImages)) {
                deletedImages.forEach((e, index) => {
                    deletedImages[index] = JSON.parse(e);
                });
            } else {
                if (deletedImages) deletedImages = [JSON.parse(deletedImages)];
                else deletedImages = [];
            }

            // VALIDATION

            if (!title || !companyName || !description) {
                logging.warning("Invalid body data");
                return next(createError(400));
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
                new Date(startTime).toString() === "Invalid Date" ||
                new Date(endTime).toString() === "Invalid Date"
            ) {
                logging.warning("Invalid time value");
                return next(createError(400));
            }

            if (
                startTime < 57600000 ||
                endTime < 57600000 ||
                startTime > 144000000 ||
                endTime > 144000000
            ) {
                logging.warning("Invalid time value");
            }

            if (
                !Number.isInteger(isDatePeriod) ||
                isDatePeriod < 0 ||
                isDatePeriod > 1
            ) {
                return next(createError(400, "Invalid isDatePeriod value"));
            }

            if (
                isDatePeriod === 1 &&
                (new Date(startDate).toString() === "Invalid Date" ||
                    new Date(startDate) > new Date(endDate))
            ) {
                return next(createError(400, "Invalid date value"));
            }

            if (
                !Number.isInteger(isWorkingWeekend) ||
                isWorkingWeekend < 0 ||
                isWorkingWeekend > 1
            ) {
                return next(createError(400, "Invalid isWorkingWeekend value"));
            }

            if (
                !Number.isInteger(isRemotely) ||
                (isRemotely !== 0 && isRemotely !== 1)
            ) {
                return next(createError(400, "Invalid isRemotely value"));
            }

            if (!Number.isInteger(salaryMin) || salaryMin < 0) {
                logging.warning("Invalid salary value");
                return next(createError(400, "Invalid salary value"));
            }

            if (
                !Number.isInteger(salaryMax) ||
                salaryMax < 0 ||
                !Number.isInteger(salaryType) ||
                salaryType <= 0
            ) {
                return next(createError(400));
            }

            if (salaryMin > salaryMax) {
                return next(createError(400, "Invalid salary value"));
            }

            const helper = new Helper();

            if (phoneNumber && !helper.checkPhoneNumberFormat(phoneNumber)) {
                return next(createError(400, "Invalid phone number format"));
            }

            if (!moneyType) {
                return next(createError(400, "Type of money is required"));
            }

            if (!moneyType || moneyType !== 1 && moneyType !== 2) {
                return next(
                    createError(400, "Invalid money type, only 1 (VND) or 2 (USD)")
                );
            }

            if (description.length > 4000) {
                return next(createError(400, "Mô tả quá dài (tối đa 4000 ký tự)"));
            }
            if (!categoryIds) {
                return next(createError(400, "CategoryIds is required"));
            }

            let isValidCategoryId = true;
            if (categoryIds.length > 2) {
                return next(createError(400, "Maximum 2 categories"));
            }
            for (let i = 0; i < categoryIds.length; i++) {
                if (!Number.isInteger(+categoryIds[i])) {
                    isValidCategoryId = false;
                    break;
                }
            }

            if (!req.body.jobTypeId || !Number.isInteger(+req.body.jobTypeId)) {
                return next(createError(400, "Invalid jobTypeId"));
            }

            if (!isValidCategoryId) {
                return next(createError(400, "Invalid categoryIds"));
            }

            // HANDLE IMAGES OF POST
            // GET CURRENT IMAGES OF POST
            const currentImages = await postImageServices.readImagesOfPost(postId);
            const currentImagesIds = currentImages.map((image) => +image.id);
            const newImages = req.files ? req.files : [];
            const deletedImageIds = deletedImages.map((image) => +image.id);

            if (currentImages.length + newImages.length - deletedImageIds.length > 5) {
                return next(createError(400, "Số lượng ảnh quá nhiều (tối đa 5 ảnh)"));
            }

            // GET IMAGES WILL BE DELETED
            if (deletedImages.length > 0) {
                let isUpdateImagesSuccess = true;
                // DELETE IMAGES OF POST BY IMAGE IDS
                for (let i = 0; i < deletedImageIds.length; i++) {
                    if (!currentImagesIds.includes(deletedImageIds[i])) {
                        isUpdateImagesSuccess = false;
                        break;
                    }
                }
                if (!isUpdateImagesSuccess) {
                    return next(createError(400, "Invalid deletedImages"));
                }
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

            // HANDLE UPDATE
            const isUpdateSuccess = await postServices.updateInformation(
                postId,
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
                description,
                helper.formatPhoneNumber(phoneNumber),
                moneyType,
                email.toString().trim(),
                newExpireDate,
                jobTypeId,
            );

            if (!isUpdateSuccess) {
                return next(createError(500, "Update post information failed"));
            }

            const urlsUploaded =
            req.files && (req.files.length as number) > 0
                ? await cloudinaryService.uploadImagesCloud(
                    newImages,
                    ImageBucket.POST_IMAGES,
                    postId
                )
                : [];
            
            if (deletedImageIds.length > 0) {
                const isDeleteImagesSuccess = await postImageServices.deleteByIds(
                    postId,
                    deletedImageIds
                );
                if (!isDeleteImagesSuccess) {
                    return next(createError(500));
                }
                // DELETE IMAGES FROM AWS
                // console.log(currentImages)
                const BASE_URL = ImageBucket.POST_IMAGES + "/" + postId + "/";
                const deletedImagesUrls = deletedImageIds.map(
                    (imageId) => {
                        // console.log(imageId, currentImagesIds.includes(imageId), );
                        if (currentImagesIds.includes(imageId)) {
                            return BASE_URL + currentImages.find((image) => image.id === imageId).image;
                        }
                    }
                );
                await cloudinaryService.deleteImagesCloud(
                    deletedImagesUrls
                );
            }
            
            // IF POST HAS NEW IMAGES => CREATE IMAGES OF POST
            if (urlsUploaded.length > 0) {
                const isCreateImagesOfPostSuccess = await postImageServices.create(
                    postId,
                    urlsUploaded
                );
                if (!isCreateImagesOfPostSuccess) {
                    return next(createError(500));
                }
            }

            // HANDLE CATEGORIES OF POST
            if (Array.isArray(categoryIds) && categoryIds.length > 0) {
                const newCategoryIds = categoryIds.map((cateId) => +cateId);
                // GET ALL CATEGORIES OF POST
                const categoriesOfPost =
                    await postCategoryServices.readCategoriesOfPost("vi", postId);
                if (categoriesOfPost) {
                    const categoryIdsOfPost = categoriesOfPost.map(
                        (category) => category.child_category_id
                    );
                    const categoryIdsWillBeCreated = [...newCategoryIds];
                    const categoryIdsWillBeDeleted = [];

                    // FILTER
                    categoryIdsOfPost.forEach((categoryId: number) => {
                        if (newCategoryIds.includes(categoryId)) {
                            // THIS CATEGORY WILL BE KEEPED
                            categoryIdsWillBeCreated.splice(
                                categoryIdsWillBeCreated.indexOf(categoryId),
                                1
                            );
                        } else {
                            // THIS CATEGORY WILL BE DELETED
                            categoryIdsWillBeDeleted.push(categoryId);
                        }
                    });

                    // MODIFY
                    if (categoryIdsWillBeCreated.length > 0) {
                        // CREATE
                        const isCreateCategoriesOfPostSuccess =
                            await postCategoryServices.create(
                                postId,
                                categoryIdsWillBeCreated
                            );
                        if (!isCreateCategoriesOfPostSuccess) {
                            return next(createError(500));
                        }
                    }

                    if (categoryIdsWillBeDeleted.length > 0) {
                        // DELETE
                        const isDeleteCategoriesOfPostSuccess =
                            await postCategoryServices.deleteCategoriesOfPostByIds(
                                postId,
                                categoryIdsWillBeDeleted
                            );
                        if (!isDeleteCategoriesOfPostSuccess) {
                            return next(createError(500));
                        }
                    }
                }
            } else {
                // DELETE ALL CATEGORIES OF POST
                await postCategoryServices.deleteByPostId(postId);
            }

            // SUCCESS
            return res.status(200).json({
                code: 200,
                success: true,
                message: "Successfully",
            });
        });
    } catch (error) {
        logging.error("Update post information controller has error: ", error);
        return next(createError(500));
    }
};

export default updatePostInformationController;
