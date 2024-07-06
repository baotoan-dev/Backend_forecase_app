import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const countTotalPostQuantity = async () => {
    try {
        const query =
            "SELECT COUNT(id) as quantity FROM posts WHERE STATUS = ?";
        const params = [0];
        const res = await executeQuery(query, params);
        return res ? res[0] : null;
    } catch (error) {
        logging.error(
            "Count total pending post quantty service has error: ",
            error
        );
        throw error;
    }
};

export default countTotalPostQuantity;
