import { executeQuery } from "../../../configs/database/database";
import logging from "../../../utils/logging";

const createDefaultPlatformNotificationService = async (
    accountId: string,
    pushStatus: number,
    emailStatus: number,
) => {
    try {
        const query = "INSERT INTO type_notification_platform " +
            "(account_id, type, push_status, email_status) " +
            "VALUES (?, 0, ?, ?)";

        const values = [accountId, pushStatus, emailStatus];

        const res = await executeQuery(query, values);

        // Assuming you want to return some confirmation or inserted ID
        const insertedId = res.insertId;
        logging.info(`Inserted row with ID: ${insertedId}`);

        return insertedId ? true : false; // Return whatever confirmation or ID you need

    } catch (error) {
        logging.error("Error in createDefaultPlatformNotificationService:", error);
        return null; // Return null or handle error response appropriately
    }
}

export default createDefaultPlatformNotificationService;
