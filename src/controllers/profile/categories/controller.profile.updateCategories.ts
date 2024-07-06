import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import * as profileCategoryService from "../../../services/profileCategory/_service.profileCategory";

const updateCategoriesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Update categories of profile controller start ...");

        // GET PROFILE ID
        const { id } = req.user;
        if (!id) {
            logging.warning("Invalid profile id");
            return next(createError(401));
        }

        // GET BODY DATA

        const categoryIds: number[] = req.body.categoryIds ? req.body.categoryIds : null;

        // VALIDATION
        if (!categoryIds || typeof categoryIds !== "object") {
            logging.warning("Invalid data");
            return next(createError(400));
        }

        for (let i = 0; i < categoryIds.length; i++) {
            if (typeof categoryIds[i] !== "number" || isNaN(+categoryIds[i])) {
                logging.warning("Invalid data");
                return next(createError(400, "Invalid data"));
            }
        }

        // HANDLE
        const categoryIdsWillBeDeleted = [];
        const categoryIdsWillBeCreated = [...categoryIds];
        const currentCategoriesOfProfile =
            await profileCategoryService.readAllByProfileId("vi", id);
        // The result is an array of object with each item has format: [{category_id: 1, ...}]
        // So, we need to map the array to get category_id only
        const currentCategoryIds = currentCategoriesOfProfile.map(
            (obj) => +obj["child_category_id"]
        );

        // console.log(">>> currentCategoryIds: ", currentCategoryIds);

        currentCategoryIds.forEach((cateId: number) => {
            // console.log("item: ", cateId);
            if (categoryIds.includes(cateId)) {
                // REMOVE ITEM FROM CATEGORY WILL BE CREATED
                categoryIdsWillBeCreated.splice(
                    categoryIdsWillBeCreated.indexOf(cateId),
                    1
                );
            } else {
                // This is the cate which will be delete
                // ADD TO CATEGORIES WILL BE DELETED
                categoryIdsWillBeDeleted.push(cateId);
            }
        });

        // console.log(`catesDelete: ${catesDelete}`);
        // console.log(`categoryIdsWillBeCreated: ${categoryIdsWillBeCreated}`);

        // HANDLE CREATE
        // console.log(">>> categoryIdsWillBeCreated: ", categoryIdsWillBeCreated);
        if (categoryIdsWillBeCreated.length > 0) {
            const isCreateSuccess =
                await profileCategoryService.createCategoriesOfProfile(
                    id,
                    categoryIdsWillBeCreated
                );
            if (!isCreateSuccess) {
                return next(createError(500));
            }
        }

        // HANDLE DELETE
        // console.log(">>> categoryIdsWillBeDeleted: ", categoryIdsWillBeDeleted);
        if (categoryIdsWillBeDeleted.length > 0) {
            const isDeleteSuccess =
                await profileCategoryService.deleteCategoriesOfProfile(
                    id,
                    categoryIdsWillBeDeleted
                );
            if (!isDeleteSuccess) {
                return next(createError(500));
            }
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        logging.error(
            "Update categories of profile controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default updateCategoriesController;
