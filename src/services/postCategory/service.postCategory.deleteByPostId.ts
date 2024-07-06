import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const deleteByPostId = async (postId: number) => {
    try {
        logging.info("Delete categories of post by post id service start ...");
        const query = "DELETE FROM posts_categories WHERE post_id = ?";
        const params = [postId];
        await executeQuery(query, params);
    } catch (error) {
        logging.error(
            "Delete categories of post by post id service has error: ",
            error
        );
        throw error;
    }
};

export default deleteByPostId;
