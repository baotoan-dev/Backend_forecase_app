import { executeQuery } from "../../../configs/database/database";
import logging from "../../../utils/logging";

const updateTypeOfNotificationPlatformService = async ({
    accountId,
    emailStatus,
    pushStatus,
}: {
    accountId: string;
    emailStatus: number;
    pushStatus: number;
}) => {
    try {

        const query = 
            "UPDATE type_notification_platform SET " +
            `${emailStatus !== -1 ? "email_status = ? " : ""}` +
            `${emailStatus !== -1 && pushStatus !== -1 ? ", " : ""}` +
            `${pushStatus !== -1 ? "push_status = ? " : ""}` +
            "WHERE account_id = ? " 
        
        const values: any[] = []
        .concat(emailStatus !== -1 ? emailStatus : [])
        .concat(pushStatus !== -1 ? pushStatus : [])
        .concat(accountId);
    
        const res = await executeQuery(query, values);

        return res;

    } catch (error) {
        logging.error(error);
        return null;
    }
}

export default updateTypeOfNotificationPlatformService;