import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const createBookmark = async (accountId: string, postId: number) => {
    try {
        logging.info("Create bookmark service start ...");
        const query =
            "INSERT INTO bookmarks (account_id, post_id) VALUES (?, ?)";

        const params = [accountId, postId];
        const res = await executeQuery(query, params);
        if (res === 'ER_DUP_ENTRY') {
            return 'ER_DUP_ENTRY'; // Duplicate entry
        }
        return res ? res.affectedRows === 1 : false;
    } catch (error) {
        logging.error("Create bookmark service has error: ", error);
        throw error;
    }
};

export default createBookmark;
