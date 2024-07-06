import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const createImagesOfPost = async (postId: number, imageUrls: Array<string>) => {
    try {
        logging.info("Create images of post service start ...");
        let query = "INSERT INTO post_images (post_id, image) VALUES ";
        let params = [];

        imageUrls.forEach((imageUrl, index) => {
            query += index === 0 ? "(?, ?)" : ",(?, ?)";
            params = [...params, postId, imageUrl];
        });

        const res = await executeQuery(query, params);
        if (!res) {
            return false;
        }
        return res.affectedRows === imageUrls.length;
    } catch (error) {
        logging.error("Create images of post service has error: ", error);
        throw error;
    }
};

export default createImagesOfPost;
