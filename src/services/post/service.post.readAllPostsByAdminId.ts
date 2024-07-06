import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

// const readAllPostsByAdminId = async (accountId) => {
//     try {
//         logging.info("Read posts service start ...");
//         const query =
//             "SELECT id, status, account_id, title, company_name, created_at " +
//             "FROM posts " +
//             "WHERE account_id = ? " +
//             "GROUP BY posts.id " +
//             "ORDER BY posts.id DESC";
//         const params = [accountId];
//         const res = await executeQuery(query, params);
//         return res ? res : null;
//     } catch (error) {
//         logging.error("Read posts service has error: ", error);
//         throw error;
//     }
// };

const readAllPostsByAdminId = async (accountId) => {
    try {
      logging.info("Read posts service start ...");

      const query =
        "SELECT id, " +
        "status, " +
        "account_id, " +
        "title, " +
        "company_name, " +
        "start_time, " +
        "end_time, " +
        "post_resource.url, " +
        "created_at " +
        "FROM posts " +
        "LEFT JOIN post_resource ON posts.id = post_resource.post_id " +
        "WHERE account_id = ? " +
        "GROUP BY posts.id " +
        "ORDER BY posts.id DESC " 
      const params = [accountId]; 
      const res = await executeQuery(query, params);
      return { data: res ? res : null };
    } catch (error) {
      logging.error("Read posts service has error: ", error);
      throw error;
    }
  };

export default readAllPostsByAdminId;
