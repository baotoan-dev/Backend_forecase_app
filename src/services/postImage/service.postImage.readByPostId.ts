import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readImagesOfPost = async (postId: number) => {
    try {
        // logging.info("Read images of post service start ...");
        const query =
            "SELECT id, image, status " +
            "FROM post_images " +
            "WHERE post_id = ? AND type = 0";
        // console.log(query)
        const params = [postId];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error("Read images of post service has error: ", error);
        throw error;
    }
};

export default readImagesOfPost;
