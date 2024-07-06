import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import logging from "../../../../utils/logging";
import * as postServices from "../../../../services/post/_service.post";
import { formatPostBeforeReturn } from "../../_controller.post.formatPostBeforeReturn";
import { isArrayNumber, isNumber } from "../../../../helpers/checkData/checkTypeOfData";
import { formatToArrayNumber, formatToStringNumberArray } from "../../../../helpers/formatData/formatArray";
import { PostResponse, PostService } from "../../../../models/interface/Post";
import readAllByProfileId from "../../../../services/profileCategory/service.profileCategory.readAllByProfileId";
import readLocationByProfileId from "../../../../services/profileLocation/service.profileLocation.readAllByProfileId";
import readServiceStillByAccountIdService from "../../../../services/serviceHistory/read/service.readServiceStillByAccountId";


const readNearbyAcceptedPostsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let childCategoryIds = [];
        let provinceIds = [];
        const limit = req.query.limit;
        const page = req.query.page;
        const accountId = req.user.id;
        const search = req.query.search ? req.query.search.toString() : null;

        if (!accountId) {
            logging.warning("Invalid account id value");
            return next(createError(400));
        }

        const childCategoriesOfProfile = await readAllByProfileId('vi', accountId);

        if (childCategoriesOfProfile.length > 0) {
            childCategoriesOfProfile.forEach((childCategory: any) => {
                childCategoryIds.push(childCategory.child_category_id);
            })
        }

        const locationOfProfile = await readLocationByProfileId('vi', accountId);

        if (locationOfProfile.length > 0) {
            locationOfProfile.forEach((location: any) => {
                provinceIds.push(location.district_id);
            })
        }

        // if (!provinceIds) {
        //     logging.warning("Invalid province id value");
        //     return next(createError(400));
        // }

        // if (parentCategoryId && isNumber(parentCategoryId) === false || +parentCategoryId <= 0) {
        //     logging.warning("Invalid parent category id value");
        //     return next(createError(400));
        // }


        // if (childCategoryIds && childCategoryIds.length > 0) {
        //     if (Array.isArray(childCategoryIds)) {
        //         if (isArrayNumber(childCategoryIds) === false) {
        //             logging.warning("Invalid child category id value");
        //             return next(createError(400, "Invalid child category id value"));
        //         }
        //     } else if (isNumber(childCategoryIds) === false || +childCategoryIds <= 0) {
        //         logging.warning("Invalid child category id value");
        //         return next(createError(400, "Invalid child category id value"));
        //     }
        // }

        // GET DATA
        let posts: PostService[];

        if ((childCategoryIds && childCategoryIds.length > 0) || (provinceIds && provinceIds.length > 0)) {
            let data =
                await (postServices.readNewestAcceptedPostsByChildCategoriesAndProvinces(
                    req.query.lang.toString() || "vi",
                    formatToArrayNumber(childCategoryIds),
                    formatToStringNumberArray(provinceIds),
                    +limit ? +limit : 10 ,
                    page ? +page : 0,
                    search
                ) as any);
            posts = data.data;
            res.locals.currentPage = data.currentPage;
            res.locals.totalPage = data.totalPage;
            res.locals.totalPost = parseInt(data.totalPost);
        }
        
        // if (parentCategoryId && provinceIds) {
        //     let data =
        //         await postServices.readNewestAcceptedPostsByParentCategoryAndProvinces(
        //             req.query.lang.toString() || "vi",
        //             req.user.id,
        //             +parentCategoryId,
        //             formatToStringNumberArray(provinceIds),
        //             +limit + 1,
        //             page ? +page : 0
        //         );
        //     posts = data.data;
        //     res.locals.currentPage = data.currentPage;
        //     res.locals.totalPage = data.totalPage;
        // }
        // if (provinceIds && provinceIds.length > 0) {
        //     let data = await postServices.readNewestAcceptedPostsByProvinces(
        //         req.query.lang.toString() || "vi",
        //         req.user.id,
        //         formatToStringNumberArray(provinceIds),
        //         +limit + 1,
        //         page ? +page : 0
        //     );
        //     posts = data.data;
        //     res.locals.currentPage = data.currentPage;
        //     res.locals.totalPage = data.totalPage
        // }

        if (!posts) {
            res.locals.posts = [];
        }
        else {
            const postResponse: PostResponse[] = await Promise.all(
                posts.map(async (post: PostService) => {
                    const dataType = await readServiceStillByAccountIdService(post.account_id);
                    let convertDataType = '';
    
                    if (Array.isArray(dataType) && dataType.length > 0) {
                        let max = dataType[0];
    
                        dataType.forEach((element) => {
                            if (element > max) {
                                max = element;
                            }
                        });
    
                        convertDataType = max;
                    } else {
                        console.log("No valid service types found.");
                    }
                    post.serviceType = convertDataType ? convertDataType : null;
                    return await formatPostBeforeReturn(post, req.query.lang.toString());
                })
            );
            res.locals.posts = postResponse;
        }

        next();

    } catch (error) {
        logging.error(
            "Read nearby accepted posts controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default readNearbyAcceptedPostsController;
