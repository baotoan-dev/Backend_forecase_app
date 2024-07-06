import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readAllByProfileId = async (profileId: string) => {
    try {
        logging.info("Read all educations by profile id service start ...");
        const query =
            "SELECT id, company_name, major, start_date, end_date, extra_information " +
            "FROM profiles_educations " +
            "WHERE account_id = ?";
        const params = [profileId];
        return executeQuery(query, params);
    } catch (error) {
        logging.error(
            `Read all educations by profile id servive has error: ${error}`
        );
        throw error;
    }
};

export default readAllByProfileId;
