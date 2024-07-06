import logging from '../../utils/logging';
import { executeQuery } from '../../configs/database/database';

const createReadStatusForSystemNotificationService = async (
    accountId: string,
    sys_notification_id: number,
) => {
    try {
        const query =
            "INSERT INTO system_notifications_read (account_id, noti_id) " +
            "VALUES (?, ?)";
        const params = [
            accountId,
            sys_notification_id,
        ];
        const result = await executeQuery(query, params);
        return result;
    } catch (error) {
        logging.error(error);
        return null;
    }
}


export default createReadStatusForSystemNotificationService;