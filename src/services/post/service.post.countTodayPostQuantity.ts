import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const countTodayPostQuantity = async () => {
    try {
        const query =
            "SELECT COUNT(posts.id) as quantity FROM posts WHERE DATE(`created_at`) = CURDATE()";
        const res = await executeQuery(query);
        return res ? res[0] : null;
    } catch (error) {
        logging.error("Count today post quantity service has error: ", error);
        throw error;
    }
};

export default countTodayPostQuantity;
