import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { expiredDateCondition, initQueryReadPost, sort, sortByCompanyResource, sortByDate } from "./_service.post.initQuery";

const readNewestAcceptedPostsByParentCategory = async (
    lang: string = "vi",
    parentCategoryId: number,
    limit: number | null,
    threshold: number | null
) => {
    try {
        logging.info(
            "Read newest accepted posts by parent category service start ..."
        );

        let query =
            initQueryReadPost(lang) +
            "JOIN posts_categories " +
            "ON posts_categories.post_id = posts.id " +
            "JOIN child_categories " +
            "ON child_categories.id = posts_categories.category_id " +
            "WHERE posts.status = ? AND posts_categories.category_id = child_categories.id " +
            expiredDateCondition() +
            "AND child_categories.parent_category_id = ? AND posts.salary_type = salary_types.id " +
            `${threshold && threshold > 0 ? "AND posts.id < ? " : " "}` +
            "GROUP BY posts.id " +
            sort([sortByDate()]) +
            `${limit && limit > 0 ? "LIMIT ?" : ""}`;

        let params = [1, parentCategoryId]
            .concat(threshold && threshold > 0 ? [threshold] : [])
            .concat(limit && limit > 0 ? [limit] : []);

        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read newest accepted posts by parent category service has error: ",
            error
        );
        throw error;
    }
};

export default readNewestAcceptedPostsByParentCategory;
