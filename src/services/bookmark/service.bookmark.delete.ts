import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const deleteBookmark = async (accountId: string, postId: number) => {
    try {
        logging.info("Delete bookmark service start ...");
        const query =
            "DELETE FROM bookmarks WHERE account_id = ? AND post_id = ?";
        const params = [accountId, postId];
        const res = await executeQuery(query, params);
        return res ? res.affectedRows === 1 : false;
    } catch (error) {
        logging.error("Delete bookmark service has error: ", error);
        throw error;
    }
};

export default deleteBookmark;
