import logging from "../../utils/logging"
import { executeQuery } from "../../configs/database/database";

const countTotalApplyService = async (recruiterId: string, type: number) => {
    try {
        logging.info('Count total apply service start ...');
        let query = '';
        if (type === 0) {
            query = `SELECT COUNT(applications.id) as total_apply FROM applications WHERE post_id IN (SELECT id FROM posts WHERE account_id = ?)`;
        }
        else {
            query = `SELECT COUNT(applications.id) as total_apply FROM applications WHERE post_id IN (SELECT id FROM posts WHERE account_id = ?) AND applications.status = ?`;
        }

        const res = await executeQuery(query, [recruiterId, type]);

        return res[0].total_apply;
    } catch (error) {
        logging.error('Count total apply service has error: ', error);
        throw error;
    }
}

export default countTotalApplyService;
