import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import logging from '../../utils/logging';
import * as searchService from '../../services/search/_service.search';
import MoneyType from '../../models/enum/money_type.enum';
import readDefaultPostImageByPostId from '../../services/category/service.category.readDefaultPostImageByPostId';
import ImageBucket from '../../models/enum/imageBucket.enum';
import isNumeric from 'validator/lib/isNumeric';
import formatPostedTime from '../../helpers/formatData/formatPostedTime';
import saveHistorySearchService from '../../services/search/service.search.saveHistory';
import readCurrentLocationsById from '../../services/profileLocation/service.profile.readCurrentLocationsById';
import readAllByProfileId from '../../services/profileCategory/service.profileCategory.readAllByProfileId';

const searchByQueryV2Controller = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // logging.info('Search V1 controller start ...');

        let lang = req.query.lang as string;

        // GET SEARCH KEYWORD
        let { q, threshold = null } = req.query;
 
        const { district_ids } = req.query;
        const { category_ids } = req.query;
        const { salary_min } = req.query;
        const { salary_max } = req.query;
        const { salary_type } = req.query;
        const { money_type  } = req.query;
        const { is_working_weekend } = req.query;
        const { is_remotely } = req.query;
        const { start_date } = req.query;
        const { end_date } = req.query;
        const { jobTypeId: job_type_id } = req.query;
        const { only_company } = req.query;
        const salary_sort  = req.query.salary_sort ? req.query.salary_sort : ''
        const expried_sort = req.query.expried_sort ? req.query.expried_sort : ''
        const sort_by = req.query.sort_by ? req.query.sort_by : ''
        // VALIDATION
        // FORMAT query to string
        if (!q) {
            q = '';
        }

        // DISTRICT IDS
        let districtIds: string[] = [];
        // if district_ids is not null
        // or if district_ids is not empty array
        // console.log('district_ids from query:', district_ids);
        if (district_ids !== null && district_ids !== undefined) {
            if (Array.isArray(district_ids)) {
                for (let i = 0; i < district_ids.length; i++) {
                    if (!isNumeric(district_ids[i] as string)) {
                        return next(createError(400, 'Invalid district_ids'));
                    }
                    districtIds.push(district_ids[i] as string);
                }
            } else {
                if (isNumeric(district_ids as string)) {
                    districtIds.push(district_ids as string);
                }
            }
        } else {
            // get district from profile location
            if (req.user) {
                const { id: userId } = req.user;
                const currentLocations = await readCurrentLocationsById(userId);
                if (currentLocations) {
                    for (let i = 0; i < currentLocations.length; i++) {
                        districtIds.push(currentLocations[i].district_id);
                    }
                }
            }
        }

        // Set districtIds to null if districtIds is empty array
        districtIds = districtIds.length > 0 ? districtIds : null;

        // console.log('districtIds:', districtIds);

        // CATEGORY IDS
        let categoryIds: number[] = [];
        // console.log('category_ids from query:', category_ids);
        if (category_ids !== null && category_ids !== undefined) {
            if (Array.isArray(category_ids)) {
                for (let i = 0; i < category_ids.length; i++) {
                    if (!isNumeric(category_ids[i] as string)) {
                        return next(createError(400, 'Invalid category_ids'));
                    }
                    categoryIds.push(parseInt(category_ids[i] as string));
                }
            } else {
                if (isNumeric(category_ids as string)) {
                    categoryIds.push(parseInt(category_ids as string));
                }
            }
        } else {
            // get category from profile
            if (req.user) {
                const { id: userId } = req.user;
                const currentCategories = await readAllByProfileId("vi", userId);
                if (currentCategories) {
                    for (let i = 0; i < currentCategories.length; i++) {
                        categoryIds.push(+currentCategories[i].child_category_id);
                    }
                }
            }
        }

        // Set categoryIds to null if categoryIds is empty array
        categoryIds = categoryIds.length > 0 ? categoryIds : null;


        // console.log('categoryIds:', categoryIds);

        let jobTypeIds: number[] = [];
        if (job_type_id) {
            if (Array.isArray(job_type_id)) {
                for (let i = 0; i < job_type_id.length; i++) {
                    if (!isNumeric(job_type_id[i] as string)) {
                        return next(createError(400, 'Invalid job_type_id'));
                    }
                    jobTypeIds.push(parseInt(job_type_id[i] as string));
                }
            } else {
                if (!isNumeric(job_type_id as string)) {
                    return next(createError(400, 'Invalid job_type_id'));
                }
                jobTypeIds.push(parseInt(job_type_id as string));
            }
        }

        // Set jobTypeIds to null if jobTypeIds is empty array
        jobTypeIds = jobTypeIds.length > 0 ? jobTypeIds : null;

        // SALARY MIN
        let salaryMin: number | null = null;
        if (salary_min) {
            if (!isNumeric(salary_min as string)) {
                return next(createError(400, 'Invalid salary_min'));
            } else {
                salaryMin = parseInt(salary_min as string);
            }
        }

        // SALARY MAX
        let salaryMax: number | null = null;
        if (salary_max) {
            if (!isNumeric(salary_max as string)) {
                return next(createError(400, 'Invalid salary_max'));
            } else {
                salaryMax = parseInt(salary_max as string);
            }
        }

        // INVALID SALARY MIN AND SALARY MAX
        if (salaryMax && salaryMin && salaryMin > salaryMax) {
            return next(createError(400, 'Invalid salary_min and salary_max'));
        }

        let salaryType: number[] = [];
        if (salary_type) {
            if (Array.isArray(salary_type)) {
                for (let i = 0; i < salary_type.length; i++) {
                    if (!isNumeric(salary_type[i] as string)) {
                        return next(createError(400, 'Invalid salary_type'));
                    }
                    salaryType.push(parseInt(salary_type[i] as string));
                }
            } else {
                if (!isNumeric(salary_type as string)) {
                    return next(createError(400, 'Invalid salary_type'));
                }
                salaryType.push(parseInt(salary_type as string));
            }
        }

        // Set salaryType to null if salaryType is empty array
        salaryType = salaryType.length > 0 ? salaryType : null;

        // IS WORKING WEEKEND
        let isWorkingWeekend: number | null = null;
        if (is_working_weekend) {
            if (!Number.isInteger(parseInt(is_working_weekend as string)) && +is_working_weekend !== 0 && +is_working_weekend !== 1) {
                return next(createError(400, "Invalid is_working_weekend"));
            } else {
                isWorkingWeekend = parseInt(is_working_weekend as string);
            }
        }

        // IS REMOTELY
        let isRemotely: number | null = null;
        if (is_remotely) {
            if (!Number.isInteger(parseInt(is_remotely as string)) && +is_remotely !== 0 && +is_remotely !== 1) {
                return next(createError(400, "Invalid is_remotely"));
            } else {
                isRemotely = parseInt(is_remotely as string);
            }
        }

        // START DATE
        let startDate: number | null = null;
        if (start_date && !Number.isInteger(parseInt(start_date as string))) {
            return next(createError(400, 'Invalid start_date'));
        } else {
            startDate = start_date ? parseInt(start_date as string) : null;
        }

        // END DATE
        let endDate: number | null = null;
        if (end_date && !Number.isInteger(parseInt(end_date as string))) {
            return next(createError(400, 'Invalid end_date'));
        } else {
            endDate = end_date ? parseInt(end_date as string) : null;
        }

        // INVALID START TIME AND END TIME
        if (startDate && endDate && startDate > endDate) {
            return next(createError(400, 'Invalid start_date and end_date'));
        }

        if (money_type && (money_type !== '1' && money_type !== '2')) {
            return next(createError(400, "Money type must be 1 (VND) or 2 (USD)"));
        }

        // search by only company name
        if (only_company && (only_company !== '0' && only_company !== '1')) {
            return next(createError(400, "only_company must be 0 or 1"));
        }

        
        if (threshold && !Number.isInteger(parseInt(threshold as string))) {
            return next(createError(400, 'Invalid threshold'));
        }
    
        // REMOVE SPACE
        q = (q as string).trim();
        q = q.toLocaleLowerCase();

        // GET BOOKMARKS
        // CHECK AUTHORIZE OR NOT?
        const { id } = req.user;

        const posts = await searchService.searchByQuery(
            lang,
            q as string,
            threshold ? +threshold : null,
            districtIds,
            categoryIds,
            salaryMin,
            salaryMax,
            salaryType,
            isWorkingWeekend,
            isRemotely,
            startDate,
            endDate,
            money_type ? +money_type : null,
            jobTypeIds,
            only_company ? +only_company : 0,
            id,
            salary_sort.toString(),
            expried_sort.toString(),
            sort_by.toString()
        );
        

        if (!posts || posts.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    posts: [],
                    total: 0,
                    is_over: true,
                },
            });
        }

        posts.total = parseInt(posts[0]?.total) || 0;


        await Promise.all(posts.map(async (element) => {

            delete element.total;
            element.start_date = +element.start_date || null;
            element.end_date = +element.end_date || null;
            element.start_time = +element.start_time || null;
            element.end_time = +element.end_time || null;
            element.created_at = new Date(element.created_at).getTime();
            element.bookmarked = element.bookmark_post_id ? true : false;
            element.money_type_text = MoneyType[element.money_type];
            element.money_type = +element.money_type;
            element.created_at_text = formatPostedTime(new Date(element.created_at).getTime(), lang);
            element.resource = {
                // company_resource_id?: number;
                // company_resource_name?: string;
                // url?: string;
                company_icon: element.company_resource_icon ? `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.COMPANY_ICON}/${element.company_resource_icon}` : null,
            }
            element.job_type = {
                job_type_id: element.job_type_id,
                job_type_name: element.job_type_name,
            }
            delete element.company_resource_icon;
            delete element.job_type_name;
            delete element.job_type_id;

            // GET IMAGE
            if (element.image === null) {
                const firstParentCategoryImage =
                    await readDefaultPostImageByPostId(
                        element.id
                    );
                if (!firstParentCategoryImage) {
                    element.image = null;
                } else {
                    element.image = firstParentCategoryImage.image;
                }
            } else {
                element.image = `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.POST_IMAGES}/${element.id}/` + element.image;
            }
        }));

        let isOver = false;
        if (posts.length < 20) {
            isOver = true;
        }

        

        // SUCCESS
        res.status(200).json({
            success: true,
            message: "Search successfully",
            data: {
                total: posts.total,
                posts,
                is_over: isOver,
            },
        });

        if (id && q) {
            saveHistorySearchService(q as string, id);
        }

        return;
    } catch (error) {
        logging.error('Search controller has error: ', error);
        return next(createError(500));
    }

    // Path: src/controllers/search/controller.search.ts
};

export default searchByQueryV2Controller;