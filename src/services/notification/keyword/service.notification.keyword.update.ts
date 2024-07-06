import { executeQuery } from "../../../configs/database/database";
import { UpdateKeywordNotificationStatusDto } from "../../../models/notification/keyword/dto/keyword-update.dto";
import logging from "../../../utils/logging";

const updateKeywordNotificationStatusService = async (dto: UpdateKeywordNotificationStatusDto) => {
    try {

        const query = `
            UPDATE keywords_notification
            SET status = ?
            WHERE id = ?
            AND account_id = ?
        `;
        
        const values = [
            // dto.districtStatus,
            // dto.categoryStatus,
            dto.status,
            dto.keywordNotificationId,
            dto.accountId,
        ];
    
        const res = await executeQuery(query, values);

        return res;

    } catch (error) {
        logging.error(error);
        return null;
    }
}

export default updateKeywordNotificationStatusService;