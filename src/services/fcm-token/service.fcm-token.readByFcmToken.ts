import logging from '../../utils/logging';
import { executeQuery } from '../../configs/database/database';

const readFcmTokenService = async (
    token: string,
) => {
  try {
    const query = 'SELECT * FROM fcm_tokens WHERE token = ?';
    const res = await executeQuery(query, [token]);
    return res ? res : null;
  } catch (error) {
    logging.error('Read all provinces has error: ', error);
    throw error;
  }
};

export default readFcmTokenService;
