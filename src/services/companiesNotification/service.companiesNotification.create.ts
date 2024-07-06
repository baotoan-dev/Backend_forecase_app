import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

async function createcompaniesNotificationService(companyId: number, isRead: number, senderId: string) {
    try {
        logging.info("Create companiesNotification service called");

        const checkExistQuery = `SELECT * FROM companies WHERE id = ?`;
        const checkExistResult = await executeQuery(checkExistQuery, [companyId]);

        if (checkExistResult.length === 0) {
            return {
                status: 404,
                data: {},
                message: "Company not found",
            }
        }

        const checkUnreadQuery = `
        SELECT *
        FROM companies_notification
        WHERE company_id = ? AND is_read = 0 AND sender_id = ?
        ORDER BY created_at DESC
        LIMIT 1
      `;
        const checkUnreadResult = await executeQuery(checkUnreadQuery, [companyId, senderId]);

        if (checkUnreadResult.length > 0) {
            const lastNotificationCreatedAt = new Date(checkUnreadResult[0].created_at);
            const threeDaysAgo = new Date(Date.now() - (3 * 24 * 60 * 60 * 1000));

            if (lastNotificationCreatedAt > threeDaysAgo) {
                return {
                    status: 400,
                    data: {},
                    message: "You have an unread notification from this company within the last 3 days",
                }
            }
        }

        const createcompaniesNotificationQuery = `
        INSERT INTO companies_notification (company_id, is_read, sender_id, company_name, message) 
        VALUES (?, ?, ?, ?, ?)
      `;
        const createcompaniesNotificationResult = await executeQuery(createcompaniesNotificationQuery, [companyId, isRead, senderId, checkExistResult[0].name, `This is a new notification ${checkExistResult[0].name}`]);

        return {
            status: 200,
            data: {
                id: createcompaniesNotificationResult.insertId.toString(), // Convert BigInt to string
                companyName: checkExistResult[0].name,
                isRead,
                senderId,
                createdAt: new Date(),
            },
            message: "Create companiesNotification successfully",
        };
    } catch (error) {
        logging.error("Create companiesNotification service has error: ", error);
        throw error;
    }
}

export default createcompaniesNotificationService;
