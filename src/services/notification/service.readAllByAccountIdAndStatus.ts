import logging from '../../utils/logging';
import { executeQuery } from '../../configs/database/database';

const readAllByAccountIdAndStatusService = async (
    accountId : string,
    status : number
) => {
    try {
        const query =
            "SELECT * FROM notifications WHERE account_id = ? AND application_status = ?";
        const params = [
            accountId,
            status,
        ];
        const result = await executeQuery(query, params);
        return result ? result[0] : null;
    } catch (error) {
        logging.error(error);
        return null;
    }
}

export default readAllByAccountIdAndStatusService;