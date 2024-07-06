import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const readWorkerAccounts = async () => {
    try {
        logging.info("Read worker accounts service start: ");
        const query = "SELECT * FROM accounts WHERE role = ?";
        const params = [2];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error("Read worker accounts service has error: ", error);
        throw error;
    }
};

// const readWorkerAccounts = async (page = 1, limit = 10) => {
//   try {
//     logging.info("Read worker accounts service start: ");
//     const offset = (page - 1) * limit;

//     const query = "SELECT * FROM accounts WHERE role = ? LIMIT ? OFFSET ?";
//     const params = [2, limit, offset];
//     const res = await executeQuery(query, params);
//     return { data: res ? res : null };
//   } catch (error) {
//     logging.error("Read worker accounts service has error: ", error);
//     throw error;
//   }
// };

export default readWorkerAccounts;
