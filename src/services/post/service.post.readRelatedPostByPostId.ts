import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { expiredDateCondition, initQueryReadPost } from "./_service.post.initQuery";

const readRelatedPostByPostIdService = async (
    lang: string,
    postId: number,
) => {
    try {
        logging.info(
            "Read newest accepted posts by provinces service start ..."
        );
        // console.log(accountId)

        let query =
            initQueryReadPost(lang) +
            "LEFT JOIN posts_categories ON posts.id = posts_categories.post_id " +
            "LEFT JOIN child_categories ON posts_categories.category_id = child_categories.id " +
            "WHERE posts.status = 1 " +
            "AND posts.id != ? " +
            `AND wards.district_id = (SELECT district_id FROM wards WHERE id = (SELECT ward_id FROM posts WHERE id = ?)) ` +
            `AND child_categories.parent_category_id IN 
            (SELECT parent_category_id FROM child_categories WHERE id IN
                (SELECT category_id FROM posts_categories WHERE post_id = ?)
            ) ` +
            expiredDateCondition() +
            "GROUP BY posts.id " +
            "ORDER BY posts.id DESC " +
            "LIMIT 10";

        let params = [postId, postId, postId];

        // console.log(query)

        const res = await executeQuery(query, params);

        // logging.info(
        //     "Read newest accepted posts by provinces service stopped with result: ",
        //     res
        // );


        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read newest accepted posts by provinces service has error: ",
            error
        );
        throw error;
    }
};

export default readRelatedPostByPostIdService;
