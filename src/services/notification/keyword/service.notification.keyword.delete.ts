import { executeQuery } from "../../../configs/database/database";
import { DeleteKeywordNotificationDto } from "../../../models/notification/keyword/dto/keyword-delete.dto";
import logging from "../../../utils/logging";

const deleteKeywordNotificationService = async (dto: DeleteKeywordNotificationDto) => {
    try {

        const query = `
            DELETE FROM keywords_notification
            WHERE id IN (${dto.keywordNotificationIds.join(',')})
            AND account_id = ?
        `;

        const values = [
            dto.accountId,
        ];
    
        const res = await executeQuery(query, values);

        return res;

    } catch (error) {
        logging.error(error);
        return null;
    }
}

export default deleteKeywordNotificationService;