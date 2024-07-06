import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

import logging from "../../utils/logging";
import * as themeServices from "../../services/theme/_service.theme";
import * as postServices from "../../services/post/_service.post";

const addPostsToThemeController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Add posts to theme start ...");

        // GET DATA
        const themeId = req.body.themeId ? +req.body.themeId : null;
        const postIds = req.body.postIds;

        // VALIDATION
        if (!Number.isInteger(themeId)) {
            logging.warning("Invalid theme id");
            return next(createError(400));
        }

        if (!Array.isArray(postIds)) {
            logging.warning("Invalid post ids");
            return next(createError(400));
        }

        let isInvalidPostIdValue;
        postIds.forEach((postId) => {
            if (!Number.isInteger(postId)) {
                isInvalidPostIdValue = true;
                return;
            }
        });
        if (isInvalidPostIdValue) {
            logging.warning("Invalid post id value");
            return next(createError(400));
        }

        // HANDLE
        // GET ALL POSTS OF THEME
        const postsOfTheme = await postServices.readAllPostsByTheme(themeId);

        // FILTER
        const postIdsWillBeDeleted = [];
        const postIdsWillBeCreated = [...postIds];
        postsOfTheme.forEach((post) => {
            if (postIds.includes(post.id)) {
                // REMOVE FROM postIdsWillBeCreated
                postIdsWillBeCreated.splice(
                    postIdsWillBeCreated.indexOf(post.id),
                    1
                );
            } else {
                postIdsWillBeDeleted.push(post.id);
            }
        });

        logging.info("postIdsWillBeCreated", postIdsWillBeCreated);
        logging.info("postIdsWillBeDeleted", postIdsWillBeDeleted);

        // ADD POSTS TO THEME
        if (postIdsWillBeCreated.length > 0) {
            const isSuccess = await themeServices.addPostsToTheme(
                themeId,
                postIdsWillBeCreated
            );
            if (!isSuccess) {
                return next(createError(500));
            }
        }

        // REMOVE POSTS FROM THEME
        if (postIdsWillBeDeleted.length > 0) {
            const isSuccess = await themeServices.removePostsFromTheme(
                themeId,
                postIdsWillBeDeleted
            );
            if (!isSuccess) {
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
        logging.error("Add posts to theme has error: ", error);
        return next(createError(500));
    }
};

export default addPostsToThemeController;
