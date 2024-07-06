import { executeQuery } from "../../configs/database/database";
import logging from "./../../utils/logging";

const readQuantityOfNewNotificationsService = async (accountId: string) => {
  try {
    // COUNT TOTAL NOTIFICATIONS
    // from database
    // from 2 table post_notification and notifications
    // where account_id = ?
    // and is_read = 0
    // get total
    const query = 
    `
        SELECT (
            SELECT COUNT(*)
            FROM post_notification
            WHERE account_id = ?
            AND is_read = 0
        ) + (
            SELECT COUNT(*)
            FROM notifications
            WHERE account_id = ?
            AND is_read = '0'
        ) AS total

    `;
    const params = [accountId, accountId];
    const result = await executeQuery(query, params);
    return result[0].total;
  } catch (error) {
    logging.error(error);
    return null;
  }
};

export default readQuantityOfNewNotificationsService;
