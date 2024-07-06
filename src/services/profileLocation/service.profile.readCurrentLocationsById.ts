import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readCurrentLocationsById = async (profileId: string) => {
    try {
        logging.info("Read all locations by profile id service start ...");
        const query =
            "SELECT " +
            "location_id as district_id " +
            "FROM profiles_locations " +
            "WHERE account_id = ?";
        const params = [profileId];
        return executeQuery(query, params);
    } catch (error) {
        logging.error(
            `Read all locations by profile id servive has error: ${error}`
        );
        throw error;
    }
};

export default readCurrentLocationsById;
