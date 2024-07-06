import { executeQuery } from "../../configs/database/database";

const readIsActiveOfCompanyService = async (accountId: string) => {
    try {
        const query = `SELECT is_active,id, account_id FROM companies WHERE account_id = ?`;
        const result = await executeQuery(query, [accountId]);

        return result ? result[0] : null;
    } catch (error) {
        throw error;
    }
}

export default readIsActiveOfCompanyService;