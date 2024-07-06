import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const countTodayPendingPostQuantity = async () => {
    try {
        const query =
            "SELECT COUNT(posts.id) as quantity FROM posts WHERE status = ? AND DATE(`created_at`) = CURDATE()";
        const params = [0];
        const res = await executeQuery(query, params);
        return res ? res[0] : null;
    } catch (error) {
        logging.error(
            "Count today pending post quantity service has error: ",
            error
        );
        throw error;
    }
};

export default countTodayPendingPostQuantity;
