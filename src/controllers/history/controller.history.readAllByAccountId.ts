import {Request, Response, NextFunction} from 'express';
import createError from 'http-errors';
import ApplicationStatus from '../../models/enum/application.enum';
import applicationService from '../../services/application/_service.application';
import logging from '../../utils/logging';
import {formatPostBeforeReturn} from '../post/_controller.post.formatPostBeforeReturn';
import MoneyType from '../../models/enum/money_type.enum';
import { readDefaultPostImageByPostId } from '../../services/category/_service.category';
import ImageBucket from '../../models/enum/imageBucket.enum';
import applicationStatusHandler from '../application/handler/applicationStatusHandler';
import readCompanyInformationByPostId from '../../services/postResource/service.postResource.readCompanyByPostId';
import formatPostedTime from '../../helpers/formatData/formatPostedTime';

const readAllByAccountId = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Read All by account id controller start ...');
    const { id: accountId } = req.user;
    const { page = "" } = req.query;
    try {
        if (page === "" || (page && (Number.isNaN(+page) || +page < 0))) {
            logging.warning("Invalid page value");
            return next(createError(400));
        }
        
        const result = await applicationService.read.readPostsAndApplicationsByAccountId(
            req.query.lang.toString(), accountId, +page
        );

        // console.log(result);
        
        if (!result) {
            return next(createError(404, 'Applications not found'));
        }

        const data = await Promise.all(result.map(async (a) => {
            if (a.type === 'post') {
                const n = a.num_of_application;
                a = await formatPostBeforeReturn(a, req.query.lang.toString());
                a.num_of_application = Number(n) || 0;
                a.type = 'post';
            }
            if (a.type === 'application') {
                a.created_at = new Date(a.created_at).getTime();
                a.application_status_text = ApplicationStatus[a.status];
                // a.num_of_application = Number(a.num_of_application);
                a.money_type = +a.money_type;
                a.money_type_text = MoneyType[a.money_type];
                a.start_date = +a.start_date || null;
                a.end_date = +a.end_date || null;
                a.application_status = applicationStatusHandler(+a.status)
                a.is_inhouse_data = +a.is_inhouse_data;
                a.job_type = {
                    job_type_id: +a.job_type,
                    job_type_name: a.job_type_name
                }
                delete a.num_of_application;
                if (a.image === null) {
                    const firstParentCategoryImage =
                    await readDefaultPostImageByPostId(
                            a.post_id
                    );
                    if (!firstParentCategoryImage) {
                        a.image = null;
                    } else {
                        a.image = firstParentCategoryImage.image;
                    }
                } else {
                    a.image = `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.POST_IMAGES}/${a.post_id}/` + a.image;
                }
                a.type = 'application';
            }
            const resource = await readCompanyInformationByPostId(a.post_id);
            if (resource) {
                a.resource = {
                    // company_resource_id?: number;
                    // company_resource_name?: string;
                    // url?: string;
                    company_icon: resource.icon ? `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.COMPANY_ICON}/${resource.icon}` : null
                }
            }
            a.created_at_text = formatPostedTime(a.created_at, req.query.lang.toString());
            a.expired_date = a.expired_date ? new Date(a.expired_date).getTime() : null;
            return a;
        }));
        
        let isOver: boolean;

        if (result.length < 10) {
            isOver = true;
        } else {
            isOver = false;
        }

        res.status(200).json({
            code: 200,
            message: 'Read all by account id controller success',
            data: data,            
            is_over: isOver,
        });
    } catch (error) {
        logging.error(error);
        next(createError(500, 'Internal server error'));
    }
    
}

export default readAllByAccountId;