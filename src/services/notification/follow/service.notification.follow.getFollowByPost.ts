import { executeQuery } from "../../../configs/database/database";
import logging from "../../../utils/logging";

const readFollowByPostDetailService = async (
    accountId: string,
) => {
    try {
        const query = `SELECT id FROM companies WHERE account_id = ?`;
        
        const values = [
            accountId,
        ];

        const res = await executeQuery(query, values);

        const companyId = res[0].id;

        const queryFollow = `SELECT account_id FROM follow_companies WHERE company_id = ?`;

        const valuesFollow = [
            companyId,
        ];

        const resFollow = await executeQuery(queryFollow, valuesFollow);

        return resFollow ? resFollow : [];
    } catch (error) {
        logging.error(error);
        return null;
    }
}

export default readFollowByPostDetailService;