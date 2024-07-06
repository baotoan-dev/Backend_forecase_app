import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const countTodayAccountQuantity = async () => {
    try {
        const query =
            "SELECT COUNT(accounts.id) as quantity FROM accounts WHERE DATE(`created_at`) = CURDATE()";
        const res = await executeQuery(query);
        return res ? res[0] : null;
    } catch (error) {
        logging.error(
            "Count today account quantity service has error: ",
            error
        );
        throw error;
    }
};

export default countTodayAccountQuantity;
