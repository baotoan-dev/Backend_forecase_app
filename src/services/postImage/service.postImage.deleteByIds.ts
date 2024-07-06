import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const deleteByIds = async (postId: number, imageIds: Array<number>) => {
    try {
        logging.info("Delete images of post by id service start ...");
        let query = "DELETE FROM post_images WHERE post_id = ? AND id in ";
        let params = [postId];

        imageIds.forEach((imageId, index) => {
            query += index === 0 ? "(?" : ", ?";
            params = [...params, imageId];
        });
        query += ")";

        const res = await executeQuery(query, params);
        return res ? res.affectedRows === imageIds.length : false;
    } catch (error) {
        logging.error("Delete images of post by id service has error: ", error);
        throw error;
    }
};

export default deleteByIds;
