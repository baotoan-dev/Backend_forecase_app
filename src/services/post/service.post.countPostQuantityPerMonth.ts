import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const countPostQuantityPerMonth = async () => {
    try {
        const query =
            "SELECT DATE_FORMAT(created_at, '%m/%Y') as date, COUNT(*) as quantity " +
            "FROM posts " +
            "GROUP BY MONTH(created_at) " +
            "ORDER BY date ASC";
        const res = await executeQuery(query);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Count post quantity by month service has error: ",
            error
        );
        throw error;
    }
};

export default countPostQuantityPerMonth;
