import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const updateExperienceOfProfile = async (
    id: number,
    title: string,
    companyName: string,
    startDate: number,
    endDate: number,
    extraInformation: string | null
) => {
    try {
        logging.info("Update experience of profie service start ...");

        const query =
            "UPDATE profiles_experiences " +
            "SET title = ?, company_name = ?, start_date = ?, end_date = ?, extra_information = ? " +
            "WHERE id = ?";

        const params = [
            title,
            companyName,
            startDate,
            endDate,
            extraInformation,
            id,
        ];

        const res = await executeQuery(query, params);
        return res ? res.affectedRows === 1 : false;
    } catch (error) {
        logging.error("Update experience of profie service has error: ", error);
        throw error;
    }
};

export default updateExperienceOfProfile;
