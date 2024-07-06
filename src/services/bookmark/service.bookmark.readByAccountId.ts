import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readBookmarksByAccountId = async (accountId: string) => {
    try {
        logging.info("Read bookmarks of account id service start ...");
        const query = "SELECT post_id from bookmarks WHERE account_id = ?";
        const params = [accountId];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read bookmarks of account id service has error: ",
            error
        );
        throw error;
    }
};

export default readBookmarksByAccountId;
