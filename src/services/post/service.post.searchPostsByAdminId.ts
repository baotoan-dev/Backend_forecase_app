import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const searchPostsByAdminId = async (accountId, search) => {
    try {
      const query =
        "SELECT id, status, account_id, title, company_name, created_at " +
        "FROM posts " +
        "WHERE account_id = ? AND (id LIKE ? OR title LIKE ? OR company_name LIKE ?) " +
        "GROUP BY posts.id " +
        "ORDER BY posts.id DESC ";
      const params = [accountId, `%${search}%`, `%${search}%`, `%${search}%`];
      const res = await executeQuery(query, params);
      return { data: res ? res : null };
    } catch (error) {
      logging.error("Read posts service has error: ", error);
      throw error;
    }
  };
  
  export default searchPostsByAdminId;
  