import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

// const readPendingPostsByAdmin = async () => {
//     try {
//         logging.info("Read pending posts by admin service start ...");
//         const query =
//             "SELECT posts.id, posts.status, posts.account_id, posts.title, posts.company_name, " +
//             "posts.created_at, profiles.name as poster " +
//             "FROM posts " +
//             "LEFT JOIN profiles " +
//             "ON profiles.id = posts.account_id " +
//             "WHERE posts.status = ? " +
//             "GROUP BY posts.id " +
//             "ORDER BY posts.id DESC";
//         const params = [0];
//         const res = await executeQuery(query, params);
//         return res ? res : null;
//     } catch (error) {
//         logging.error("Read pending posts by admin service has error: ", error);
//         throw error;
//     }
// };


const readPendingPostsByAdmin = async () => {
    try {
      logging.info("Read pending posts by admin service start ...");

      // const countQuery = "SELECT COUNT(*) as total FROM posts WHERE status = ?";
      // const countParams = [0];
      // const countResult = await executeQuery(countQuery, countParams);
      // const totalPosts = countResult[0].total;
      
      const query = `
        SELECT posts.id, posts.status, posts.account_id, posts.title, posts.company_name,
          posts.created_at, profiles.name as poster
        FROM posts
        LEFT JOIN profiles
          ON profiles.id = posts.account_id
        WHERE posts.status = ?
        GROUP BY posts.id
        ORDER BY posts.id DESC`;
      const params = [0];
      const res = await executeQuery(query, params);
      return { data: res ? res : null };
    } catch (error) {
      logging.error("Read pending posts by admin service has error: ", error);
      throw error;
    }
  };
  

export default readPendingPostsByAdmin;
