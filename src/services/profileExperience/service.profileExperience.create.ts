import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createExperienceOfProfile = async (
    profileId: string,
    title: string,
    companyName: string,
    startDate: number,
    endDate: number,
    extraInformation: string | null
) => {
    try {
        logging.info("Create experience of profie service start ...");

        const query =
            "INSERT INTO profiles_experiences (account_id, title, company_name, start_date, end_date, extra_information) VALUES (?, ?, ?, ?, ?, ?)";
        const params = [
            profileId,
            title,
            companyName,
            startDate,
            endDate,
            extraInformation,
        ];

        const res = await executeQuery(query, params);
        return res ? res.affectedRows === 1 : false;
    } catch (error) {
        logging.error("Create experience of profie service has error: ", error);
        throw error;
    }
};

export default createExperienceOfProfile;
