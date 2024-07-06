import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { expiredDateCondition, initQueryReadPost } from "./_service.post.initQuery";

const readNewestAcceptedPostsByChildCategories = async (
    lang: string = "vi",
    chilCategoryIds: number[],
    limit: number | null,
    threshold: number | null
) => {
    try {
        logging.info(
            "Read newest accepted posts by child categories service start ..."
        );
        let query =
            initQueryReadPost(lang) +
            "LEFT JOIN posts_categories " +
            "ON posts.id = posts_categories.post_id " +
            "WHERE posts.status = ? AND posts_categories.category_id IN " +
            `(${chilCategoryIds.map((_) => "?").join(", ")}) ` +
            `${threshold && threshold > 0 ? "AND posts.id < ? " : " "}` +
            expiredDateCondition() +
            "GROUP BY posts.id ORDER BY posts.id DESC LIMIT ?"

        let params = [1]
            .concat(chilCategoryIds)
            .concat(threshold && threshold > 0 ? [threshold] : [])
            .concat(limit && limit > 0 ? [limit] : []);

        // chilCategoryIds.forEach((chilCategoryId, index) => {
        //     query += index === 0 ? `(?` : `, ?`;
        //     params = [...params, chilCategoryId];
        // });

        // query += threshold && threshold > 0 ? ") AND posts.id < ? " : ") ";
        // params =
        //     threshold && threshold > 0 ? [...params, threshold] : [...params];

        // query +=
        //     limit && limit > 0
        //         ? "GROUP BY posts.id ORDER BY posts.id DESC LIMIT ?"
        //         : "GROUP BY posts.id ORDER BY posts.id DESC";
        // params = limit && limit > 0 ? [...params, limit] : [...params];
        // console.log(query, params)
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read newest accepted posts by child categories service has error: ",
            error
        );
        throw error;
    }
};

export default readNewestAcceptedPostsByChildCategories;
