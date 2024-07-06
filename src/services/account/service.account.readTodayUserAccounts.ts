import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

// const readTodayUserAccounts = async () => {
//     try {
//         logging.info("Read today accounts service start: ");
//         const res = await executeQuery(
//             "SELECT * FROM accounts WHERE role = 0 AND DATE(created_at) = CURDATE()"
//         );
//         return res ? res : null;
//     } catch (error) {
//         logging.error("Read today accounts service has error: ", error);
//         throw error;
//     }
// };

const readTodayUserAccounts = async (page = 1 , limit = 10) => {
    try {
      logging.info("Read today accounts service start: ");
      const offset = (page - 1) * limit;

      // const countQuery = "SELECT COUNT(*) as total FROM accounts WHERE role = 0 AND DATE(created_at) = CURDATE()";
      // const countResult = await executeQuery(countQuery);
      // const totalAccounts = countResult[0].total;

      const query =
        "SELECT * FROM accounts WHERE role = 0 AND DATE(created_at) = CURDATE() LIMIT ? OFFSET ?";
      const params = [limit, offset];
      const res = await executeQuery(query, params);
      return {data: res ? res : null };
    } catch (error) {
      logging.error("Read today accounts service has error: ", error);
      throw error;
    }
};
  

export default readTodayUserAccounts;
