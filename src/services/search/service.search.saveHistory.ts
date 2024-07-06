import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const saveHistorySearchService = async (keyword: string, accountId: string) => {
    try {
        // Check if keyword is empty
        if (!keyword) {
            return;
        }

        // Check if keyword is already in history
        const queryRead = `
            SELECT * FROM search_history
            WHERE keyword = ? AND account_id = ?
        `;

        const paramsRead = [keyword, accountId];

        const result: any = await executeQuery(
            queryRead,
            paramsRead,
        );

        if (result.length > 0) {
            // Update
            const queryUpdate = `
                UPDATE search_history
                SET count = count + 1
                WHERE keyword = ? AND account_id = ?
            `;

            const paramsUpdate = [ keyword, accountId];

            await executeQuery(
                queryUpdate,
                paramsUpdate,
            );

            return;
        }

        // Insert
        const queryInsert = `
            INSERT INTO search_history (keyword, account_id)
            VALUES (?, ?)
        `;

        const params = [keyword, accountId];

        await executeQuery(
            queryInsert,
            params,
        );

        return;
    } catch (error) {
        logging.error(error);
        throw error;
    }
    
};

export default saveHistorySearchService;