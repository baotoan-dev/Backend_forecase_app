import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";


const searchPendingPostsByAdmin = async (search) => {
    try {
      logging.info("Read pending posts by admin service start ...");
  
      const query = `
        SELECT posts.id, posts.status, posts.account_id, posts.title, posts.company_name,
          posts.created_at, profiles.name as poster
        FROM posts
        LEFT JOIN profiles
          ON profiles.id = posts.account_id
        WHERE posts.status = 0 AND (posts.id = ? OR posts.title LIKE ? OR posts.company_name LIKE ?)
        GROUP BY posts.id
        ORDER BY posts.id DESC`;
      const params = [search, `%${search}%`, `%${search}%`];
      const res = await executeQuery(query, params);
      return { data: res ? res : null };
    } catch (error) {
      logging.error("Read pending posts by admin service has error: ", error);
      throw error;
    }
  };
  
  export default searchPendingPostsByAdmin;
  