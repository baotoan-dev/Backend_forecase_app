import logging from '../../utils/logging';
import { executeQuery } from '../../configs/database/database';

const readAllProvinces = async (search:string) => {
  try {
    // logging.info("Read all provinces service start ...");
    let query = 'SELECT * FROM provinces';
    if (search) {
      query += ` WHERE name LIKE '%${search}%'`;
    }
    const res = await executeQuery(query);
    return res ? res : null;
  } catch (error) {
    logging.error('Read all provinces has error: ', error);
    throw error;
  }
};

export default readAllProvinces;
