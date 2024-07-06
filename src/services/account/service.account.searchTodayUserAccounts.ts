import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const searchTodayUserAccounts = async (search) => {
  try {
    logging.info("Search today accounts service start: ");
    const query = `SELECT id, email, phone FROM accounts WHERE role = 0 AND DATE(created_at) = CURDATE() AND (id LIKE '%${search}%' OR email LIKE '%${search}%' OR phone LIKE '%${search}%')`;
    const res = await executeQuery(query);
    return { data: res ? res : null };
  } catch (error) {
    logging.error("Search today accounts service has error: ", error);
    throw error;
  }
};

export default searchTodayUserAccounts;



