import createError from 'http-errors';
import { Response, Request, NextFunction } from 'express';
import logging from '../../../utils/logging';

import applicationService from '../../../services/application/_service.application';
import * as postService from '../../../services/post/_service.post';
import ApplicationStatus from '../../../models/enum/application.enum';
import ImageBucket from '../../../models/enum/imageBucket.enum';
import applicationStatusHandler from '../../application/handler/applicationStatusHandler';
// import MoneyType from '../../../enum/money_type.enum';

const readApplicationsByPostIdController = async (req: Request, res: Response, next: NextFunction) => {
    const { post_id: postId } = req.params;
    const { id: ownerId, role } = req.user;
    const { page, limit = -1 } = req.query;
    try {

        if (!postId) {
            return next(createError(400, 'Post id is required'));
        }

        logging.info(`Read applications of post id start ...`);
        if (Number.isNaN(Number(postId))) {
            throw createError(400, 'Post id is not a number');
        }

        // CHECK IF USER IS OWNER OF JOB        
        const post = await postService.readStatusAndAccountIdById(+postId);
        
        if (!post) {
            return next(createError(404, 'Post not found'));
        }

        if (post.account_id !== ownerId && role !== 1) {
            return next(createError(406, 'You are not allowed to access this resource'));
        }

        // READ APPLICATIONS
        const applications = await applicationService.read.readAllByPostId(
            +postId,
            +limit + 1, 
            +page ? +page : 1
        );

        if (!applications) {
            return next(createError(404, "Applications not found"));
        }
        

        // READ CATEGORIES OF APPLICATIONS
        const data = await Promise.all(applications.map(async (a) => {
            a.created_at = new Date(a.created_at).getTime();
            a.birthday = a.birthday ? +a.birthday : null;
            a.application_status = applicationStatusHandler(a.application_status)
            a.application_status_text = ApplicationStatus[a.application_status];
            a.categories = await applicationService.read.readCategoriesById(req.query.lang.toString(), a.id);
            a.liked = +a.liked;
            a.liked_value = a.liked === 0 ? null : a.liked === 1 ? true : false;
            a.avatar = a.avatar ? 
                `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.AVATAR_IMAGES}/` + a.avatar : null;
            return a;
        }));        

        let isOver: boolean = false;

        if (limit) {
            if (applications.length <= +limit) {
                isOver = true;
            }
        } else {
            isOver = true;
        }

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Read application successfully",
            data: {
                applications: data
            },
            is_over: isOver
        });
    }
    catch (error) { 
        logging.error(error);
        next(createError(500, "Internal server error"));
    }
};

export default readApplicationsByPostIdController;