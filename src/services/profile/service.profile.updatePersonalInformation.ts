import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const updatePersonalInformationService = async (
    id: string,
    name: string,
    birthday: number,
    gender: number,
    address: string,
    introduction: string,
    jobTypeId: number,
    jobTypeName: string
  ) => {
    try {
      logging.info("Update personal information of profile service start ...");
      const query =
        "UPDATE profiles " +
        "SET name = ?, birthday = ?, gender = ?, address = ?, introduction = ? " +
        `${jobTypeId ? ", job_type_id = ? " : ""}` +
        `${(jobTypeName || jobTypeName === '') ? ", job_name = ? " : ""}` +
        "WHERE id = ?";
      const params = [name, birthday, gender, address, introduction];
      // console.log(query);
      if (jobTypeId) params.push(jobTypeId);
      if (jobTypeName || jobTypeName === '') params.push(jobTypeName);
      params.push(id);
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
