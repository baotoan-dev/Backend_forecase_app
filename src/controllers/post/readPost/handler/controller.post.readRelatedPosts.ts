import { NextFunction, Request, Response } from "express";
import logging from "../../../../utils/logging";
import createHttpError from "http-errors";
import * as postServices from "../../../../services/post/_service.post";
import readRelatedPostByPostIdService from "../../../../services/post/service.post.readRelatedPostByPostId";
import { PostResponse } from "../../../../models/interface/Post";
import { formatPostBeforeReturn } from "../../_controller.post.formatPostBeforeReturn";
// import readCategoriesOfPost from "../../../../services/postCategory/service.postCategory.readByPostId";

const readRelatedPostsController = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement read related posts controller
    // Rules:
    // - Get post id from req.params.postId
    // - Get lang from req.query.lang
    // - Validate post id and lang
    // - Call read related posts service with post id and lang
    // - Releated will be posts with same category and same district
    // - Max 10 posts (Not include current post, newest post first)
    // - Format response
    // - Return response


    try {

        logging.info("Read related posts controller called");

        const postId = +req.params.postId;
        if (!Number.isInteger(postId)) {
            return next(createHttpError(400, "Bad request"));
        }

        const lang = req.query.lang as string;

        // const categoriesRepository = await readCategoriesOfPost(lang, postId);
        // const categories = [];
        // if (!categoriesRepository) {
        //     return next(createHttpError(500, "Internal server error"));
        // } else {
        //     categoriesRepository.forEach((category) => {
        //         categories.push(category.child_category_id);
        //     });
        // }

        const posts = await readRelatedPostByPostIdService(lang, postId);

        if (!posts) {
            return next(createHttpError(500, "Internal server error"));
        }

        
        let postResponses: PostResponse[] = await Promise.all(
            posts.map(async (post) => {
                return await formatPostBeforeReturn(post, req.query.lang.toString());
            })
        );
        res.locals.posts = postResponses;
        next();

    } catch (error) {
        logging.error("Read related posts controller has error: ", error);
        return next(createHttpError(500, "Internal server error"));
    }
}

export default readRelatedPostsController;