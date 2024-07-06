import logging from '../../utils/logging';
import { executeQuery } from '../../configs/database/database';

const readFcmTokenService = async (
    accountId: string,
) => {
  try {
    const query = 'SELECT * FROM fcm_tokens WHERE account_id = ?';
    const res = await executeQuery(query, [accountId]);
    return res ? res : null;
  } catch (error) {
    logging.error('Read all provinces has error: ', error);
    throw error;
  }
};

export default readFcmTokenService;
