import logging from '../../utils/logging';
import { executeQuery } from '../../configs/database/database';

const createSystemNotificationService = async (
    message: string,
) => {
    try {
        const query =
            "INSERT INTO system_notifications (message) " +
            "VALUES (?)";
        const params = [
            message,
        ];
        const result = await executeQuery(query, params);
        return result;
    } catch (error) {
        logging.error(error);
        return null;
    }
}

export default createSystemNotificationService;