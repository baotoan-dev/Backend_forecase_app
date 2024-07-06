import { executeQuery } from '../../../configs/database/database';
import logging from '../../../utils/logging';

const countSaveCommunity = async (accountId: string) => {
  try {
    const query = `
    SELECT COUNT(*) AS total
    FROM communication_bookmarked
    WHERE account_id = ?;
    `;

    const params = [accountId];

    const res = await executeQuery(query, params);

    return res;
  } catch (error) {
    logging.error(error);
    throw new Error(error.message);
  }
};

export default countSaveCommunity;
