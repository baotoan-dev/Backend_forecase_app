import logging from '../../utils/logging';
import { executeQuery } from '../../configs/database/database';

const updateFcmTokenService = async (
    accountId: string,
    fcmToken: string
) => {
  try {
    // logging.info("Read all provinces service start ...");
    const query = 'UPDATE fcm_tokens SET account_id = ?, status = 1 WHERE token = ?';
    
    const res = await executeQuery(query, [accountId, fcmToken]);
    if (res === "ER_NO_REFERENCED_ROW_2") {
        return false;
    }
    return res ? res : null;
  } catch (error) {
    logging.error("Create fcm token error: ", error);
    return false;
  }
};

export default updateFcmTokenService;
