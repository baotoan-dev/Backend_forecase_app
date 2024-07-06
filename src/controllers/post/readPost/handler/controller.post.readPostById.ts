import createError from "http-errors";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import logging from "../../../../utils/logging";
import * as postServices from "../../../../services/post/_service.post";
import * as postCategoryServices from "../../../../services/postCategory/_service.postCategory";
import * as postImageServices from "../../../../services/postImage/_service.postImage";
import * as bookmarkServices from "../../../../services/bookmark/_service.bookmark";
import applicationServices from "../../../../services/application/_service.application";
import ApplicationStatus from "../../../../models/enum/application.enum";
import ImageBucket from "../../../../models/enum/imageBucket.enum";
import applicationStatusHandler from "../../../application/handler/applicationStatusHandler";
import readCurrentLocationsById from "../../../../services/profileLocation/service.profile.readCurrentLocationsById";
import readAllByProfileId from "../../../../services/profileCategory/service.profileCategory.readAllByProfileId";
import { formatPostDetailBeforeReturn } from "../_controller.post.formatPostDetailBeforeReturn";
import ProfilesBucket from "../../../../models/enum/profileBucket.enum";
import createViewJobs from "../../../../services/viewJob/service.createViewJob";

interface Payload {
    id: string;
    role: number;
}

const readPostByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let fit = 0;
        let proviceIdOfPost = '';
        let countCompareProvice = 0;
        let countCompareCategory = 0;
        let lengthCategoriesOfPost = 0;

        // logging.info("Read post by id controller start ...");

        // GET POST ID
        const postId = req.params.id ? +req.params.id : null;

        // console.log(postId)
        // VALIDATION
        if (!Number.isInteger(postId)) {
            logging.warning("Invalid post id");
            return next(createError(400));
        }

        // GET DATA
        // GET POST DATA
        let postData = await postServices.readPostById(postId, req.query.lang.toString());

        if (postData === null) {
            return next(createError(500));
        }

        if (postData[0].id === null) {
            return next(createError(404, "Post not found."));
        }

        // console.log(postData);
        // CHANGE TIMESTAMP
        postData = await formatPostDetailBeforeReturn(postData[0], req.query.lang.toString());

        proviceIdOfPost = postData.province_id;

        postData.avatar_poster =
            postData.avatar_poster ?
                `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.AVATAR_IMAGES}/${postData.avatar_poster}` : null;

        // GET CATEGORIES OF POST
        const categories = await postCategoryServices.readCategoriesOfPost(
            req.query.lang.toString(),
            postId
        );


        if (!categories) {
            return next(createError(500));
        }

        lengthCategoriesOfPost = categories.length;

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
        if (req.headers.authorization) {

            const headerAuthorization = req.headers.authorization;

            if (!headerAuthorization) {
                logging.warning("readPost: Invalid header authorization");
                return next(createError(401));
            }
            // GET ACCESS TOKEN
            const accessToken = headerAuthorization.split("Bearer")[1]
                ? headerAuthorization.split("Bearer")[1].toString().trim()
                : null;

            if (!accessToken) {
                logging.warning("Invalid access token");
                return next(createError(401));
            }

            // VERIFY ACCESS TOKEN
            jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET,
                async function (err, payload: Payload) {
                    if (err) {
                        // EXPIRED ERROR
                        if (err.name === "TokenExpiredError") {
                            logging.error("Token expired");
                            return next(createError(403));
                        }

                        // OTHER ERROR
                        logging.error(err.message);
                        return next(createError(401));
                    }

                    // VERIFY SUCCESS
                    const accountId = payload.id;

                    if (postData.account_id !== accountId && postData.status === 0) {
                        return next(createError(404, "Post not found."));
                    }

                    const profileLocation = await readCurrentLocationsById(accountId);

                    profileLocation.forEach((location) => {
                        if (location.province_id === proviceIdOfPost) {
                            countCompareProvice++;
                        }
                    });

                    const profileCategories = await readAllByProfileId('vi', accountId)

                    categories.forEach((category) => {
                        profileCategories.forEach((profileCategory) => {
                            if (category.id === profileCategory.child_category_id) {
                                countCompareCategory++;
                            }
                        });
                    });

                    fit = (countCompareCategory + countCompareProvice) / (lengthCategoriesOfPost + 1) * 100;

                    // GET BOOKMARKS OF ACCOUNT
                    const bookmarks = await bookmarkServices.readByAccountId(
                        accountId
                    );
                    if (!bookmarks) {
                        return next(createError(500));
                    }

                    const postIdsOnBookmark = bookmarks.map(
                        (bookmark) => bookmark.post_id
                    );

                    // CHECK APPLIED?
                    const application =
                        await applicationServices.read.readByPostIdAndAccountId(
                            postId,
                            accountId
                        );

                    let cvApplication = null;

                    if (application) {
                        cvApplication = application.cv_url ? `${process.env.AWS_BUCKET_PREFIX_URL}/${ProfilesBucket.APPLICATION_BUCKET}/${application.id}/${application.cv_url}` : null;
                    }

                    
                    await createViewJobs(accountId, postId);

                    // SUCCESS
                    return res.status(200).json({
                        code: 200,
                        success: true,
                        data: {
                            ...postData,
                            categories,
                            images,
                            fit,
                            bookmarked: postIdsOnBookmark.includes(postData.id),
                            applied: application ? true : false,
                            application_status: application ? applicationStatusHandler(+application.status) : null,
                            application_status_text:
                                ApplicationStatus[application?.status],
                            cvApplication: cvApplication
                        },
                        message: "Successfully",
                    });
                }
            );
        } else {
            // SUCCESS
            if (postData.status === 0) {
                return next(createError(404, "Post not found."));
            }
            return res.status(200).json({
                code: 200,
                success: true,
                data: {
                    ...postData,
                    categories,
                    images,
                    fit: 0,
                    bookmarked: null,
                    applied: null,
                    application_status: null,
                    application_status_text: null,
                    cvApplication: null
                },
                message: "Successfully",
            });
        }
    } catch (error) {
        logging.error("Read post by id controller has error: ", error);
        return next(createError(500));
    }
};

export default readPostByIdController;
