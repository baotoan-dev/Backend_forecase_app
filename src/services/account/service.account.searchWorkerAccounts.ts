import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";


const searchWorkerAccounts = async (search) => {
    try {
      logging.info("Search worker accounts service start: ");
  
      const query =
        "SELECT id, email, phone, gg_id, fb_id, apple_id, role, created_at, updated_at FROM accounts WHERE role = 2 AND (id LIKE ? OR email LIKE ?)";
      const params = [`%${search}%`, `%${search}%`];
      const res = await executeQuery(query, params);
      return { data: res ? res : null };
    } catch (error) {
      logging.error("Read worker accounts service has error: ", error);
      throw error;
    }
  };
  
  export default searchWorkerAccounts;
  
