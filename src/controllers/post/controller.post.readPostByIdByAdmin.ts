import createError from "http-errors";
// import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import logging from "../../utils/logging";
import * as postServices from "../../services/post/_service.post";
import * as postCategoryServices from "../../services/postCategory/_service.postCategory";
import * as postImageServices from "../../services/postImage/_service.postImage";
import * as bookmarkServices from "../../services/bookmark/_service.bookmark";
// import applicationServices from "../../services/application/_service.application";
// import ApplicationStatus from "../../enum/application.enum";
// import MoneyType from "../../enum/money_type.enum";
import { formatPostBeforeReturn } from "./_controller.post.formatPostBeforeReturn";
import ImageBucket from "../../models/enum/imageBucket.enum";

interface Payload {
    id: string;
    role: number;
}

const readPostByIdByAdminController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // logging.info("Read poste by id controller start ...");

        const { role, id } = req.user;

        if (req.user === undefined) {
            return next(createError(401));
        }
        if (role !== 1 && role !== 2) {
            return next(createError(406, "You are not admin"));
        }

        // GET POST ID
        const postId = req.params.id ? +req.params.id : null;
       
        // VALIDATION
        if (!Number.isInteger(postId)) {
            logging.warning("Invalid post id");
            return next(createError(400));
        }

        // GET DATA
        // GET POST DATA
        let postData = await postServices.readPostByIdByAdminService(postId);

        if (postData === null) {
            return next(createError(500));
        }

        if (postData[0] === undefined) {
            return next(createError(404, "Post not found."));
        }

        // CHANGE TIMESTAMP
        postData = await formatPostBeforeReturn(postData[0], req.query.lang.toString());

        // GET CATEGORIES OF POST
        const categories = await postCategoryServices.readCategoriesOfPost(
            "vi",
            postId
        );
        if (!categories) {
            return next(createError(500));
        }

        // GET IMAGES OF POST
        const images = await postImageServices.readImagesOfPost(postId);
        if (!images) {
            return next(createError(500));
        }
        
        images.forEach((image) => {
            image.image = `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.POST_IMAGES}/${postId}/` + image.image;
        });

        // CHECK BOOKMARKED?
        // CHECK AUTHORIZE OR NOT?
        return res.status(200).json({
            code: 200,
            success: true,
            data: {
                ...postData,
                categories,
                images,
                bookmarked: null,
                applied: null,
                application_status: null,
            },
            message: "Successfully",
        });

    } catch (error) {
        logging.error("Read post by id controller has error: ", error);
        return next(createError(500));
    }
};

export default readPostByIdByAdminController;
