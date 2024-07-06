import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

// const readTodayPendingPostsByAdmin = async () => {
//     try {
//         logging.info("Read today pending posts by admin service start ...");
//         const query =
//             "SELECT posts.id, posts.status, posts.account_id, posts.title, posts.company_name, " +
//             "posts.created_at, profiles.name as poster " +
//             "FROM posts " +
//             "LEFT JOIN profiles " +
//             "ON profiles.id = posts.account_id " +
//             "WHERE DATE(posts.created_at) = CURDATE() AND posts.status = ? " +
//             "GROUP BY posts.id " +
//             "ORDER BY posts.id DESC";
//         const params = [0];
//         const res = await executeQuery(query, params);
//         return res ? res : null;
//     } catch (error) {
//         logging.error(
//             "Read today pending posts by admin service has error: ",
//             error
//         );
//         throw error;
//     }
// };

const readTodayPendingPostsByAdmin = async () => {
    try {
      logging.info("Read today pending posts by admin service start ...");
;
      const query =
        "SELECT posts.id, posts.status, posts.account_id, posts.title, posts.company_name, " +
        "posts.created_at, profiles.name as poster " +
        "FROM posts " +
        "LEFT JOIN profiles " +
        "ON profiles.id = posts.account_id " +
        "WHERE DATE(posts.created_at) = CURDATE() AND posts.status = ? " +
        "GROUP BY posts.id " +
        "ORDER BY posts.id DESC "
      const params = [0]; 
      const res = await executeQuery(query, params);
      return { data: res ? res : null };
    } catch (error) {
      logging.error(
        "Read today pending posts by admin service has error: ",
        error
      );
      throw error;
    }
  };

export default readTodayPendingPostsByAdmin;
