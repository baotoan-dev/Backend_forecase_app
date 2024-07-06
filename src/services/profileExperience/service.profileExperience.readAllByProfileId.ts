import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readAllByProfileId = async (profileId: string) => {
    try {
        logging.info("Read all experiences by profile id service start ...");
        const query =
            "SELECT id, title, company_name, start_date, end_date, extra_information " +
            "FROM profiles_experiences " +
            "WHERE account_id = ?";
        const params = [profileId];
        return executeQuery(query, params);
    } catch (error) {
        logging.error(
            `Read all experiences by profile id servive has error: ${error}`
        );
        throw error;
    }
};

export default readAllByProfileId;
