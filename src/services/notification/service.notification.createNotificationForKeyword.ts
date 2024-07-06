import logging from '../../utils/logging';
import { executeQuery } from '../../configs/database/database';

const createNotificationForKeywordService = async (
    account_id: string[],
    post_id: string,
    type: number
) => {
    try {
        const valuesList = account_id.map(() => '(?, ?, ?)').join(',');
        const query =
            "INSERT INTO post_notification (account_id, post_id, type) " +
            `VALUES ${valuesList}`;

        const params = account_id.flatMap((item: string) => [item, post_id, type]);

        const result = await executeQuery(query, params);
        return result;
    } catch (error) {
        logging.error(error);
        return null;
    }
};

export default createNotificationForKeywordService;