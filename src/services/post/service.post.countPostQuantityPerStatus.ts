import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const countPostQuantityPerStatus = async () => {
    try {
        const query =
            "SELECT status, COUNT(*) as quantity " +
            "FROM posts " +
            "GROUP BY status " +
            "ORDER BY status ASC";
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

export default countPostQuantityPerStatus;
