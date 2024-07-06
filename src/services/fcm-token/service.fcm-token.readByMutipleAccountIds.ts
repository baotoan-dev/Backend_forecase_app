import logging from '../../utils/logging';
import { executeQuery } from '../../configs/database/database';

const readFcmTokenMultipleAccountIdsService = async (
    accountIds: string[],
) => {
  try {
    const query = `
      SELECT * FROM fcm_tokens 
      WHERE account_id IN (${accountIds.map(() => '?').join(', ')})
    `;
    // console.log(query, ' query');
    // console.log(accountIds, ' accountIds');
    const res = await executeQuery(query, [...accountIds]);
    return res ? res : null;
  } catch (error) {
    logging.error('Read all provinces has error: ', error);
    throw error;
  }
};

export default readFcmTokenMultipleAccountIdsService;
