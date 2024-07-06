import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const createViewJobs = async (accountId: string, postId: number) => {
    try {
        // Kiểm tra xem bản ghi đã tồn tại chưa
        const checkQuery = `
            SELECT * FROM view_jobs 
            WHERE account_id = ? AND post_id = ?
        `;
        const existingRecords = await executeQuery(checkQuery, [accountId, postId]);

        if (existingRecords.length === 0) {
            // Nếu chưa tồn tại, thêm bản ghi mới
            const insertQuery = `
                INSERT INTO view_jobs (account_id, post_id) 
                VALUES (?, ?)
            `;
            await executeQuery(insertQuery, [accountId, postId]);
            logging.info(`Successfully added view job for account_id: ${accountId}, post_id: ${postId}`);
        } else {
            logging.info(`View job for account_id: ${accountId}, post_id: ${postId} already exists`);
        }
    } catch (error) {
        logging.error(`Error creating view job: ${error.message}`);
    }
};

export default createViewJobs;
