import {executeQuery} from '../../../configs/database/database';
import logging from '../../../utils/logging';

const countCreateCommunity = async (accountId: string) => {
  try {
    const query = `
    SELECT COUNT(*) AS total
    FROM communications
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

export default countCreateCommunity;
