import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createEducationOfProfile = async (
    profileId: string,
    companyName: string,
    major: string,
    startDate: number,
    endDate: number,
    extraInformation: string | null,
    academicTypeId: number
) => {
    try {
        logging.info("Create education of profie service start ...");

        const query =
            "INSERT INTO profiles_educations (account_id, company_name, major, start_date, end_date, extra_information, academic_type_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const params = [
            profileId,
            companyName,
            major,
            startDate,
            endDate,
            extraInformation,
            academicTypeId,
        ];

        const res = await executeQuery(query, params);
        return res ? res.affectedRows === 1 : false;
    } catch (error) {
        logging.error("Create education of profie service has error: ", error);
        throw error;
    }
};

export default createEducationOfProfile;
