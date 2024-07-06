import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const countPostQuantityByDayByAccountId = async (accountId) => {
    try {

        // Only count post quantity by today
        const query =
            "SELECT DATE_FORMAT(created_at, '%d/%m/%Y') as date, COUNT(*) as quantity " +
            "FROM posts " +
            "WHERE account_id = ? " +
            "AND DATE(created_at) = CURDATE()";
        const params = [accountId];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Count post quantity per day by account id service has error: ",
            error
        );
        throw error;
    }
};

export default countPostQuantityByDayByAccountId;
