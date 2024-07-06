import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const searchUserAccounts = async (search) => {
    try {
      logging.info("Search all accounts service start: ");
    
      const query = `SELECT id, email, phone, created_at FROM accounts WHERE role = 0 AND (id LIKE '%${search}%' OR email LIKE '%${search}%' OR phone LIKE '%${search}%')`;
    
      const res = await executeQuery(query);
      return { data: res ? res : null };
    } catch (error) {
      logging.error("Search all accounts service has error: ", error);
      throw error;
    }
  };
  
  export default searchUserAccounts;
  
