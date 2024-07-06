import { executeQuery } from '../../configs/database/database';
import logging from '../../utils/logging';

const updateReadStatusForNotificationService = async (
    isRead: number,
    id: number,
    account_id: string,
) => {
    try {
        const query = "UPDATE notifications SET is_read = ? WHERE id = ? AND account_id = ?";
        const params = [isRead.toString(), id, account_id];
        const result = await executeQuery(query, params);
        return result;
    } catch (error) {
        logging.error(error);
        throw error;
    }
}

export default updateReadStatusForNotificationService;

