import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const createPost = async (
    accountId: string,
    title: string,
    companyName: string,
    wardId: string,
    address: string,
    latitude: number,
    longitude: number,
    isDatePeriod: number,
    isWorkingWeekend: number,
    isRemotely: number,
    startDate: number | null,
    endDate: number | null,
    startTime: number,
    endTime: number,
    salaryMin: number,
    salaryMax: number,
    salaryType: number,
    description: string | null,
    phoneNumber: string | null = null,
    moneyType: number,
    role: number,
    jobTypeId: number | null = null,
    email: string | null = null,
    expiredDate: Date | null = null
) => {
    try {
        logging.info("Create post service start ...");
        const fields = [
            "account_id",
            "title",
            "company_name",
            "address",
            "latitude",
            "longitude",
            "ward_id",
            "is_date_period",
            "is_working_weekend",
            "is_remotely",
            "start_date",
            "end_date",
            "start_time",
            "end_time",
            "salary_min",
            "salary_max",
            "salary_type",
            "description",
            "phone_contact",
            "money_type",
            "job_type",
            "email",
            "expired_date",
            "is_inhouse_data",
            "status" //test

        ]
        const query =
            "INSERT INTO posts(" +
            fields.join(",").replace(/"/g, " ") +
            ") " +
            "VALUES("+
            fields.map((field) => "?").join(",") +
            ")";
        const params = [
            accountId,
            title,
            companyName,
            address,
            latitude,
            longitude,
            wardId,
            isDatePeriod,
            isWorkingWeekend,
            isRemotely.toString(),
            startDate,
            endDate,
            startTime,
            endTime,
            salaryMin,
            salaryMax,
            salaryType,
            description,
            phoneNumber,
            moneyType,
            jobTypeId,
            email,
            expiredDate,
            role === 1 || role === 2 ? '1' : '0',
            1 //test
        ];
        const res = await executeQuery(query, params);
        return res ? Number(res.insertId) : null;
    } catch (error) {
        logging.error("Create post service has error: ", error);
        throw error;
    }
};

export default createPost;
