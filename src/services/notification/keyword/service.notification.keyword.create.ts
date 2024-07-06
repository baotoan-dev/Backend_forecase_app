import { executeQuery } from "../../../configs/database/database";
import { CreateKeywordNotificationDto } from "../../../models/notification/keyword/dto/keyword-create.dto";
import logging from "../../../utils/logging";

const createKeywordNotificationService = async (dto: CreateKeywordNotificationDto) => {
    try {
        const query = "INSERT INTO keywords_notification " +
            "(keyword, category_id, category_status, district_id, district_status, account_id) " +
            "VALUES (?, ?, ?, ?, ?, ?)";
        
        const values = [
            dto.keyword,
            dto.category_id,
            dto.category_status,
            dto.district_id,
            dto.district_status,
            dto.accountId
        ];

        const res = await executeQuery(query, values);
        // Assuming you want to return the inserted row's ID or some confirmation
        const insertedId = res.insertId;
        logging.info(`Inserted row with ID: ${insertedId}`);

        return insertedId ? true : false;

    } catch (error) {
        logging.error("Error in createKeywordNotificationService:", error);
        throw error; // Rethrow the error to be handled elsewhere if needed
    }
}

export default createKeywordNotificationService;
