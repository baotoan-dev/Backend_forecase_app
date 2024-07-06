import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const updatePersonalInformationService = async (
    id: string,
    name: string,
    phone: string,
  ) => {
    try {
      logging.info("Update personal information of profile service start ...");
      const query =
        "UPDATE profiles " +
        "SET name = ?, phone = ? " +
        "WHERE account_id = ?";
      const params = [name, phone, id];

      const res = await executeQuery(query, params);
      // console.log(res);
      return res ? res.affectedRows === 1 : false;
    } catch (error) {
      console.log(
        "Update personal information of profile service has error: ",
        error
      );
      throw error;
    }
  };

export default updatePersonalInformationService;
