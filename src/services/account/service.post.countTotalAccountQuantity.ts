import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const countTotalAccountQuantity = async () => {
    try {
        const query = "SELECT COUNT(id) as quantity FROM accounts";
        const res = await executeQuery(query);
        return res ? res[0] : null;
    } catch (error) {
        logging.error("Count total account quantty service has error: ", error);
        throw error;
    }
};

export default countTotalAccountQuantity;
