import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const deleteByPostId = async (postId: number) => {
    try {
        logging.info("Delete images of post by post id service start ...");
        const query = "DELETE FROM post_images WHERE post_id = ?";
        const params = [postId];
        await executeQuery(query, params);
    } catch (error) {
        logging.error(
            "Delete images of post by post id service has error: ",
            error
        );
        throw error;
    }
};

export default deleteByPostId;
