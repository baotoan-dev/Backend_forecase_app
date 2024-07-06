import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const deleteHistorySearchService = async (
    accountId: string,
    keyword: string
) => {
    try {
        // Delete keyword from database
        const isDeleteSuccess = await executeQuery(
            `DELETE FROM search_history WHERE account_id = ? AND keyword = ?`,
            [accountId, keyword]
        );

        return isDeleteSuccess;

    }
    catch (error) {
        logging.error(error);
        throw new Error(error);
    }
}

export default deleteHistorySearchService;