import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { expiredDateCondition, initQueryReadPost } from "./_service.post.initQuery";

const readNewestAcceptedPostsByParentCategoryAndDistricts = async (
    lang: string = "vi",
    parentCategoryId: number,
    districtIds: string[],
    limit: number | null,
    threshold: number | null
) => {
    try {
        logging.info(
            "Read newest accepted posts by parent category and districts service start ..."
        );

        let query = 
            initQueryReadPost(lang) + 
            "JOIN posts_categories " +
            "ON posts_categories.post_id = posts.id " +
            "JOIN child_categories " +
            "ON child_categories.id = posts_categories.category_id " +
            "JOIN parent_categories " +
            "ON parent_categories.id = child_categories.parent_category_id " +
            "WHERE posts.status = ? AND parent_categories.id = ? " +
            `${districtIds.length > 0 ? `AND district_id IN (${districtIds.map((_) => `?`).join(", ")})` : ""}` +
            `${threshold && threshold > 0 ? "AND posts.id < ? " : " "}` +
            expiredDateCondition() +
            "GROUP BY posts.id DESC LIMIT ?"
        let params = [1, parentCategoryId, ...districtIds]
        .concat(threshold && threshold > 0 ? [threshold] : [])
        .concat(limit && limit > 0 ? [limit] : []);            
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read newest accepted posts by parent category and districts service has error: ",
            error
        );
        throw error;
    }
};

export default readNewestAcceptedPostsByParentCategoryAndDistricts;
