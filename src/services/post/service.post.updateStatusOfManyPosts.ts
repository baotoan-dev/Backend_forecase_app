import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const updateStatus = async (postIds: number[], status: number) => {
    try {
        logging.info("Update status of many posts service start ...");
        let query = "UPDATE posts SET status = ? WHERE id IN ";
        let params = [status];

        postIds.forEach((postId, index) => {
            query += index === 0 ? "(?" : ", ?";
            params = [...params, postId];
        });

        query += ")";

        const res = await executeQuery(query, params);
        return res ? res.affectedRows === postIds.length : false;
    } catch (error) {
        logging.error("Update status of many posts service has error: ", error);
        throw error;
    }
};

export default updateStatus;
