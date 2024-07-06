import { executeQuery } from "../../../configs/database/database";
import logging from "../../../utils/logging";

const readTypeOfNotificationPlatformService = async ({
    accountId,
}: {
    accountId: string;
}) => {
    try {

        const query = `
            SELECT type, email_status, push_status
            FROM type_notification_platform
            WHERE account_id = ?
        `;
        
        const values = [
            accountId,
        ];
    
        const res = await executeQuery(query, values);

        return res;

    } catch (error) {
        logging.error(error);
        return null;
    }
}

export default readTypeOfNotificationPlatformService;