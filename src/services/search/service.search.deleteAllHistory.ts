import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const deleteAllHistorySearchService = async (
    accountId: string,
) => {
    try {
        // Delete keyword from database
        const isDeleteSuccess = await executeQuery(
            `DELETE FROM search_history WHERE account_id = ?`,
            [accountId]
        );

        return isDeleteSuccess;

    }
    catch (error) {
        logging.error(error);
        throw new Error(error);
    }
}

export default deleteAllHistorySearchService;