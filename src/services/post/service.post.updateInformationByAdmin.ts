import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const updateInformationByAdmin = async (
    postId: number,
    title: string,
    companyName: string,
    wardId: string,
    address: string,
    phoneContact: string | null,
    isDatePeriod: number,
    isWorkingWeekend: number,
    isRemotely: number,
    startDate: number,
    endDate: number,
    startTime: number,
    endTime: number,
    salaryMin: number,
    salaryMax: number,
    salaryType: number,
    moneyType: number,
    description: string,
    email: string | null = null,
    jobType: number | null = null,
    expiredDate: Date | null = null
) => {
    try {
        logging.info("Update post information service start ...");
        const query =
            "UPDATE posts " +
            "SET title = ?, company_name = ?, ward_id = ?, address = ?, phone_contact = ?, is_date_period = ?, " +
            "start_date = ?, end_date = ?, start_time = ?, end_time = ?, is_working_weekend = ?, is_remotely = ?, " +
            "salary_min = ?, salary_max = ?, salary_type = ?, description = ?, " +
            "money_type = ?, email = ?, job_type = ?, expired_date = ? " +
            "WHERE id = ?";
        const params = isDatePeriod
            ? [
                  title,
                  companyName,
                  wardId,
                  address,
                  phoneContact,
                  isDatePeriod,
                  startDate,
                  endDate,
                  startTime,
                  endTime,
                  isWorkingWeekend,
                  isRemotely.toString(),
                  salaryMin,
                  salaryMax,
                  salaryType,
                  description,
                  moneyType,
                  email,
                  jobType,
                  expiredDate,
                  postId,
              ]
            : [
                  title,
                  companyName,
                  wardId,
                  address,
                  phoneContact,
                  isDatePeriod,
                  null,
                  null,
                  startTime,
                  endTime,
                  isWorkingWeekend,
                  isRemotely.toString(),
                  salaryMin,
                  salaryMax,
                  salaryType,
                  description,
                  moneyType,
                  email,
                  jobType,
                  expiredDate,
                  postId,
              ];
        // console.log(params);
        const res = await executeQuery(query, params);
        return res ? res.affectedRows === 1 : false;
    } catch (error) {
        logging.error("Update post information service has error: ", error);
        throw error;
    }
};

export default updateInformationByAdmin;
