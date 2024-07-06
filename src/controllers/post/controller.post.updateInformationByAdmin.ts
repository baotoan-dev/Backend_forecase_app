import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../utils/logging";
import * as postServices from "../../services/post/_service.post";
import * as postImageServices from "../../services/postImage/_service.postImage";
import * as postCategoryServices from "../../services/postCategory/_service.postCategory";
import Helper from "../../helpers/helper.class";
import updatePostResourceService from "../../services/postResource/service.postResource.update";
import readPostResourceService from "../../services/postResource/service.postResource.readByPostId";
import createPostResourceService from "../../services/postResource/service.postResource.create";

const updatePostInformationByAdminController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Update post information controller start ...");
        // GET BODY DATA
        const postId = +req.body.id;
        const title = req.body.title ? req.body.title.toString().trim() : null;
        const companyName = req.body.companyName
            ? req.body.companyName.toString().trim()
            : null;
        const wardId = req.body.wardId ? req.body.wardId : null;
        const address = req.body.address ? req.body.address : null;
        const phoneContact = req.body.phoneContact
            ? req.body.phoneContact
            : null;
        const isDatePeriod = +req.body.isDatePeriod;
        const isWorkingWeekend = +req.body.isWorkingWeekend;
        const isRemotely = +req.body.isRemotely;
        const startDate = +req.body.startDate;
        const endDate = +req.body.endDate;
        const startTime = +req.body.startTime;
        const endTime = +req.body.endTime;
        const salaryMin = +req.body.salaryMin;
        const salaryMax = +req.body.salaryMax;
        const salaryType = +req.body.salaryType;
        const description = req.body.description ? req.body.description.toString().trim() : null;
        const categoryIds = req.body.categoryIds
            ? typeof req.body.categoryIds === "string"
                ? [req.body.categoryIds]
                : req.body.categoryIds
            : null;
        const moneyType = req.body.moneyType ? +req.body.moneyType : null;
        const enabledImageIds = req.body.enabledImageIds
            ? req.body.enabledImageIds
            : null;
        let disabledImageIds = req.body.disabledImageIds
            ? req.body.disabledImageIds
            : null;
        // NEW FIELDS
        let jobTypeId = req.body.jobTypeId ? +req.body.jobTypeId : null;
        let companyResourceId = req.body.companyResourceId
            ? +req.body.companyResourceId : null;
        let url = req.body.url ? req.body.url : null;
        let email = req.body.email ? req.body.email : null;
        const expiredDate = Number.isInteger(+req.body.expiredDate) ? +req.body.expiredDate : null;

        // console.log(req.body);

        // VALIDATION
        if (!Number.isInteger(postId) || postId <= 0) {
            logging.error("Invalid post id");
            return next(createError(400));
        }

        if (!title || !companyName || !description || !wardId || !address) {
            logging.warning("Invalid body data");
            return next(createError(400));
        }

        const helper = new Helper();

        // if (phoneContact && !helper.checkPhoneNumberFormat(phoneContact)) {
        //     logging.warning("Invalid phone number format");
        //     return next(createError(400));
        // }



        if (
            new Date(startTime).toString() === "Invalid Date" ||
            new Date(endTime).toString() === "Invalid Date"
        ) {
            logging.warning("Invalid time value");
            return next(createError(400));
        }

        if (
            !Number.isInteger(isDatePeriod) ||
            isDatePeriod < 0 ||
            isDatePeriod > 1
        ) {
            logging.warning("Invalid isDatePeriod value");
            return next(createError(400));
        }

        if (
            isDatePeriod === 1 &&
            (new Date(startDate).toString() === "Invalid Date" ||
                new Date(startTime).toString() === "Invalid Date" ||
                new Date(startDate) > new Date(endDate))
        ) {
            logging.warning("Invalid date value");
            return next(createError(400));
        }

        if (
            !Number.isInteger(isWorkingWeekend) ||
            isWorkingWeekend < 0 ||
            isWorkingWeekend > 1
        ) {
            logging.warning("Invalid isWorkingWeekend value");
            return next(createError(400));
        }

        if (!Number.isInteger(isRemotely) || isRemotely < 0 || isRemotely > 1) {
            logging.warning("Invalid isRemotely value");
            return next(createError(400));
        }

        if (!Number.isInteger(salaryMin) || salaryMin < 0) {
            logging.warning("Invalid salary value");
            return next(createError(400));
        }

        if (!Number.isInteger(salaryMax) || salaryMax < 0) {
            logging.warning("Invalid salary value");
            return next(createError(400));
        }

        if (!Number.isInteger(salaryType) || salaryType <= 0) {
            logging.warning("Invalid salaryType value");
            return next(createError(400));
        }

        if (!moneyType) {
            logging.warning("Invalid money type");
            return next(createError(400, "Type of money is required"));
        }

        if (moneyType !== 1 && moneyType !== 2) {
            logging.warning("Invalid money type");
            return next(
                createError(400, "Invalid money type, only 1 (VND) or 2 (USD)")
            );
        }

        if (description.length > 4000) {
            logging.warning("Description is too long");
            return next(createError(400, "Mô tả quá dài (tối đa 4000 ký tự)"));
        }
        if (!categoryIds) {
            logging.warning("Invalid categoryIds");
            return next(createError(400, "CategoryIds is required"));
        }

        let isValidCategoryId = true;
        if (categoryIds.length > 2) {
            logging.warning("Invalid categoryIds");
            return next(createError(400, "Maximum 2 categories"));
        }
        categoryIds.forEach((categoryId) => {
            if (!Number.isInteger(+categoryId)) {
                isValidCategoryId = false;
                return;
            }
        });
        if (!isValidCategoryId) {
            logging.warning("Invalid categoryIds");
            return next(createError(400, "Invalid categoryIds"));
        }

        // NEW FIELDS
        if (jobTypeId && !Number.isInteger(jobTypeId)) {
            logging.warning("Invalid jobTypeId");
            return next(createError(400, "Invalid jobTypeId"));
        }

        if (companyResourceId && !Number.isInteger(companyResourceId)) {
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

        // HANDLE UPDATE
        const isUpdateSuccess = await postServices.updateInformationByAdmin(
            postId,
            title,
            companyName,
            wardId,
            address,
            helper.formatPhoneNumber(phoneContact),
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
            moneyType,
            description,
            email,
            jobTypeId,
            newExpireDate
        );

        if (!isUpdateSuccess) {
            // console.log("Update post information failed");
            return next(createError(500));
        }

        // HANDLE IMAGES OF POST
        if (enabledImageIds.length > 0) {
            await postImageServices.updateStatus(enabledImageIds, 1);
        }

        if (disabledImageIds.length > 0) {
            await postImageServices.updateStatus(disabledImageIds, 0);
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

        if (companyResourceId && url) {
            // CHECK EXIST COMPANY RESOURCE
            const isExistCompanyResource =
                await readPostResourceService(postId);

            if (isExistCompanyResource) {
                console.log("EXIST");
                // UPDATE COMPANY RESOURCE
                const isUpdateCompanyResourceSuccess =
                    await updatePostResourceService(
                        postId,
                        url,
                        +companyResourceId
                    );
                
    
                if (isUpdateCompanyResourceSuccess !== 1 && isUpdateCompanyResourceSuccess !== 0) {
                    return next(createError(500));
                }
            } else {
                // CREATE COMPANY RESOURCE
                const isCreateCompanyResourceSuccess =
                    await createPostResourceService(
                        postId,
                        url,
                        +companyResourceId
                    );
                if (!isCreateCompanyResourceSuccess) {
                    return next(createError(500));
                }
            }
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Update post information controller has error: ", error);
        return next(createError(500));
    }
};

export default updatePostInformationByAdminController;
