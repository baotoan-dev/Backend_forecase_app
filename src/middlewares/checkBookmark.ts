import { Response } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { NextFunction } from 'express';
import { Request } from 'express';
import { PostResponse, PostService } from "../models/interface/Post";
import logging from '../utils/logging';
import { readByAccountId } from '../services/bookmark/_service.bookmark';

const checkBookmark = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const posts = res.locals.posts;
    const currentPage = res.locals.currentPage ? res.locals.currentPage : 0;
    const totalPage = res.locals.totalPage ? res.locals.totalPage : 0;
    const totalPost = res.locals.totalPost ? res.locals.totalPost : 0;
    
    if (req.headers.authorization) {
        const headerAuthorization = req.headers.authorization;
        // GET ACCESS TOKEN
        const accessToken = headerAuthorization.split("Bearer")[1]
            ? headerAuthorization.split("Bearer")[1].toString().trim()
            : null;

        if (!accessToken) {
            logging.warning("Invalid access token");
            return next(createError(401));
        }

        // VERIFY ACCESS TOKEN
        try {
            const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as { id: string, role: number };
            const accountId = payload.id;

            // GET BOOKMARKS OF ACCOUNT
            const bookmarks = await readByAccountId(
                accountId
            );

            if (!bookmarks) {
                return next(createError(500, "Internal server error"));
            }
            const postIdsOnBookmark = bookmarks.map(
                (bookmark) => bookmark.post_id
            );


            // SUCCESS
            return res.status(200).json({
                success: true,
                data: {
                    currentPage,
                    totalPage,
                    totalPost,
                    posts: posts.map(
                        (post: PostResponse) => {
                            return {
                                ...post,
                                bookmarked: postIdsOnBookmark.includes(post.id) ? true : false
                            }
                        }
                    ),
                    is_over: posts.length < +req.query.limit ? true : false,
                }
            });


        } catch (error) {
            // EXPIRED ERROR
            if (error.name === "TokenExpiredError") {
                logging.error("Token expired");
                return next(createError(403));
            }
            if (error.name === "JsonWebTokenError") {
                logging.error("Invalid token");
                return next(createError(401));
            }
        }
    } else {
        // SUCCESS
        return res.status(200).json({
            success: true,
            data: {
                currentPage: currentPage,
                totalPage: totalPage,
                posts: posts,
                totalPost: totalPost,
                is_over: posts.length <= +req.query.limit ? true : false,
            }
        });
    }
}

export { checkBookmark };