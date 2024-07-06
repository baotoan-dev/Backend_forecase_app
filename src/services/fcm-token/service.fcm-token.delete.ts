import logging from '../../utils/logging';
import { executeQuery } from '../../configs/database/database';

const deleteFcmTokenService = async (
    accountId: string,
    fcmToken: string
) => {
  try {
    const query = 'DELETE FROM fcm_tokens WHERE account_id = ? AND token = ?';
    const res = await executeQuery(query, [accountId, fcmToken]);
    // console.log(res);
    return res ? res : null;
  } catch (error) {
    logging.error('Read all provinces has error: ', error);
    throw error;
  }
};

export default deleteFcmTokenService;
