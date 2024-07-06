import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const updateStatus = async (postId: number, status: number) => {
    try {
        logging.info("Update post status service start ...");
        const query = "UPDATE posts SET status = ? WHERE id = ?";
        const params = [status, postId];
        const res = await executeQuery(query, params);
        return res ? res.affectedRows === 1 : false;
    } catch (error) {
        logging.error("Update post status service has error: ", error);
        throw error;
    }
};

export default updateStatus;