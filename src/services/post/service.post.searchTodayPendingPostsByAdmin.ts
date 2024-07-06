import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const searchTodayPendingPostsByAdmin = async (searchPost) => {
    try {
      logging.info("Read today pending posts by admin service start ...");
  
      const query =
        `SELECT posts.id, posts.status, posts.account_id, posts.title, posts.company_name,
          posts.created_at, profiles.name as poster
        FROM posts
        LEFT JOIN profiles
          ON profiles.id = posts.account_id
        WHERE DATE(posts.created_at) = CURDATE() AND posts.status = ? 
          AND (posts.id LIKE '%${searchPost}%' OR posts.title LIKE '%${searchPost}%' OR posts.company_name LIKE '%${searchPost}%')
        GROUP BY posts.id
        ORDER BY posts.id DESC`;
        
      const params = [0];
      const res = await executeQuery(query, params);
      return { data: res ? res : null };
    } catch (error) {
      logging.error("Read today pending posts by admin service has error: ", error);
      throw error;
    }
  };
  
  export default searchTodayPendingPostsByAdmin;
  
