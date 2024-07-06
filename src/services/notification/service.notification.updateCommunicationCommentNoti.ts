import { executeQuery } from '../../configs/database/database';
import logging from '../../utils/logging';

const updateReadStatusForNotificationCommunicationComment = async (
    isRead: number,
    id: number,
    // account_id: string,
) => {
    try {

        logging.info("Updating notification status");

        const query = "UPDATE communication_notifications SET status = ? WHERE id = ?";
        const params = [isRead, id,];
        const result = await executeQuery(query, params);
        return result;
    } catch (error) {
        logging.error(error);
        throw error;
    }
}

export default updateReadStatusForNotificationCommunicationComment;

