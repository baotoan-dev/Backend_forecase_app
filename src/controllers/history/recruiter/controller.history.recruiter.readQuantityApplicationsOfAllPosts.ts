import { Request, Response, NextFunction } from 'express';
import logging from '../../../utils/logging';
import createError from 'http-errors';
import applicationService from '../../../services/application/_service.application';
// import MoneyType from '../../../enum/money_type.enum';
import { formatPostBeforeReturn } from '../../post/_controller.post.formatPostBeforeReturn';
import { readAllPostByStatusOfApply } from '../../../services/history/_service.history';
// import readDefaultPostImageByPostId from '../../../services/category/service.category.readDefaultPostImageByPostId';

const readQuantityApplicationOfAllPostsController = async (req: Request, res: Response, next: NextFunction) => {
    const { id: recruiterId } = req.user;
    const { limit = 10, page = 1, type } = req.query;
    const { status = -1 } = req.query;
    if (isNaN(+status)) {
        return next(createError(400, "Invalid data"));
    }
    try {
        if (+type === 0) {
            const titles = await applicationService.read.readByRecruiterId(
                req.query.lang.toString(),
                recruiterId,
                +limit,
                +page ? +page : 1,
                +status
            );

            if (!titles) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: "Not found any posts",
                    data: []
                });
            }

            const data = await Promise.all(titles.map(async (post) => {
                const numOfApplication = post.num_of_application;
                post = await formatPostBeforeReturn(post, req.query.lang.toString());
                post.num_of_application = Number(numOfApplication) || 0;
                return post;
            }));

            let isOver: boolean = false;

            if (limit) {
                if (titles.length <= +limit) {
                    isOver = true;
                }
            } else {
                isOver = true;
            }

            return res.status(200).json({
                code: 200,
                success: true,
                message: "Read title successfully",
                data: data,
                is_over: isOver
            });
        }

        else {
            const allIdOfPost = await readAllPostByStatusOfApply(+type, recruiterId);

            if (allIdOfPost.length === 0) {
                return res.status(404).json({
                    code: 404,
                    success: false,
                    message: "Not found any posts",
                    data: []
                });
            }

            const titles = await applicationService.read.readApplicationByArrayIdService(
                req.query.lang.toString(),
                +limit,
                +page ? +page : 1,
                +status,
                allIdOfPost.map((item: any) => item.id)
            );

            const data = await Promise.all(titles.map(async (post) => {
                const numOfApplication = post.num_of_application;
                post = await formatPostBeforeReturn(post, req.query.lang.toString());
                post.num_of_application = Number(numOfApplication) || 0;
                return post;
            }));

            let isOver: boolean = false;

            if (limit) {
                if (titles.length <= +limit) {
                    isOver = true;
                }
            } else {
                isOver = true;
            }


            return res.status(200).json({
                code: 200,
                success: true,
                message: "Read title successfully",
                data: data,
                is_over: isOver
            });
        }


    } catch (error) {
        logging.error(error);
        next(createError(500, "Internal server error"));
    }
}

export default readQuantityApplicationOfAllPostsController;