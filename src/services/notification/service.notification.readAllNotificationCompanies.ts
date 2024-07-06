import logging from '../../utils/logging';
import { executeQuery } from '../../configs/database/database';

const readAllNotificationCompaniesService = async (page, limit) => {
    try {
        const query =
            `SELECT * from companies_notification ORDER BY created_at DESC LIMIT ? OFFSET ?`;

        const params = [limit, page * limit];
        const result = await executeQuery(query, params);
        return result;
    } catch (error) {
        logging.error(error);
        return null;
    }
}

export default readAllNotificationCompaniesService;
