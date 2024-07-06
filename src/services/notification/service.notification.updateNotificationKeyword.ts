import { executeQuery } from '../../configs/database/database';
import logging from '../../utils/logging';

const updateReadStatusForNotificationKeywordService = async (
    isRead: number,
    id: number,
    account_id: string,
) => {
    try {

        logging.info("Updating notification status");

        const query = "UPDATE post_notification SET is_read = ? WHERE id = ? AND account_id = ?";
        const params = [isRead, id, account_id];
        const result = await executeQuery(query, params);
        return result;
    } catch (error) {
        logging.error(error);
        throw error;
    }
}

export default updateReadStatusForNotificationKeywordService;

