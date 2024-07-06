import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const countBookmarkPostService = async (accountId) => {
    try {

        // Only count post quantity by today
        const query =
            "SELECT COUNT(*) AS total FROM bookmarks WHERE account_id = ?"
        const params = [accountId];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Count apply post error: ",
            error
        );
        throw error;
    }
};

export default countBookmarkPostService;
