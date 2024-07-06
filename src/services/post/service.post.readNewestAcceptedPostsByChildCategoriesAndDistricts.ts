import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { expiredDateCondition, initQueryReadPost } from "./_service.post.initQuery";

const readNewestAcceptedPostsByChildCategoriesAndDistricts = async (
    lang: string = "vi",
    chilCategoryIds: number[],
    districtIds: string[],
    limit: number | null,
    threshold: number | null
) => {
    try {
        logging.info(
            "Read newest accepted posts by child categories and districts service start ..."
        );

        // console.log(chilCategoryIds, districtIds, limit, threshold);

        let query =
            initQueryReadPost(lang) +
            "LEFT JOIN posts_categories "+
            "ON posts_categories.post_id = posts.id "+
            "WHERE posts.status = ? AND posts.salary_type = salary_types.id AND wards.district_id IN " +
            `(${districtIds.map((_) => "?").join(", ")}) ` +
            "AND posts.id = posts_categories.post_id AND posts_categories.category_id IN " +
            `(${chilCategoryIds.map((_) => "?").join(", ")}) ` +
            `${threshold && threshold > 0 ? "AND posts.id < ? " : " "}` +
            expiredDateCondition() +
            "GROUP BY posts.id ORDER BY posts.id DESC LIMIT ?";        
                
        let params: any[] = [1];
        params = [...params, ...districtIds, ...chilCategoryIds]
        .concat(threshold && threshold > 0 ? [threshold] : [])
        .concat(limit && limit > 0 ? [limit] : []);

        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read newest accepted posts by child categories and districts service has error: ",
            error
        );
        throw error;
    }
};

export default readNewestAcceptedPostsByChildCategoriesAndDistricts;
