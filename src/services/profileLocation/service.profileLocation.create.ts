import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createLocationsOfProfile = async (
    profileId: string,
    locationIds: Array<String>
) => {
    try {
        logging.info("Create locations of profie service start ...");

        let query =
            "INSERT INTO profiles_locations (account_id, location_id) VALUES ";
        let params = [];
        locationIds.forEach((locationId, index) => {
            if (index === 0) {
                query += "(?, ?)";
            } else {
                query += ",(?, ?)";
            }
            params = [...params, profileId, locationId];
        });

        const createRes = await executeQuery(query, params);
        return createRes.affectedRows === locationIds.length ? true : createRes;
    } catch (error) {
        logging.error("Create locations of profie service has error: ", error);
        throw error;
    }
};

export default createLocationsOfProfile;
