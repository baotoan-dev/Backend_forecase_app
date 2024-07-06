import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readDefaultPostImageByPostId = async (postId: number) => {
    try {
        // logging.info("Read default post image by post id service start ...");
        const query =
            "SELECT parent_categories.default_post_image as image " +
            "FROM posts_categories " +
            "LEFT JOIN child_categories ON child_categories.id = posts_categories.category_id " +
            "LEFT JOIN parent_categories ON parent_categories.id = child_categories.parent_category_id " +
            "WHERE posts_categories.post_id = ? " +
            "LIMIT 1";
        const params = [postId];
        const res = await executeQuery(query, params);
        return res ? res[0] : null;
    } catch (error) {
        logging.error("Read default post image has error: ", error);
        throw error;
    }
};

export default readDefaultPostImageByPostId;    
