import { Request, Response, NextFunction } from "express";
import logging from "../../../utils/logging";
import createError from "http-errors";
import * as postService from "../../../services/post/_service.post";
// import readDefaultPostImageByPostId from '../../../services/category/service.category.readDefaultPostImageByPostId';
// import ImageBucket from '../../../enum/imageBucket.enum';
import { formatPostBeforeReturn } from "../../post/_controller.post.formatPostBeforeReturn";

const readPostedJobByRecruiterIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id: recruiterId } = req.user;
    const { threshold, limit } = req.query;


    try {
        const posts = await postService.readAllPostsByAccountIdService(
            req.query.lang.toString(),
            recruiterId,
            +threshold,
            +limit + 1
        );

        if (!posts) {
            return next(createError(404, "Not found any post"));
        }

        const data = await Promise.all(
            posts.map(async (post) => {
                post = await formatPostBeforeReturn(post, req.query.lang.toString());
                return post;
            })
        );

        let isOver: boolean = false;

        if (posts.length <= +limit) {
            isOver = true;
        }

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Read posts successfully",
            data: data,
            is_over: isOver,
        });
    } catch (error) {
        logging.error(error);
        next(createError(500, "Internal server error"));
    }
};

export default readPostedJobByRecruiterIdController;
