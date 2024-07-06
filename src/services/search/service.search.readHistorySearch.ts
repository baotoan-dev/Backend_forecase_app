import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const readHistorySearchByAccountIdService = async (
    accountId: string, 
    limit: number,
    page: number = 0
) => {
    try {
        // Read history search
        const query = `
            SELECT keyword FROM search_history
            WHERE account_id = ?
            ORDER BY updated_at DESC
            LIMIT ? OFFSET ?
        `;

        const params = [accountId, limit, page * limit];

        const result: any = await executeQuery(
            query,
            params,
        );

        return result;
    } catch (error) {
        logging.error(error);
        return null;
    }
}

export default readHistorySearchByAccountIdService;