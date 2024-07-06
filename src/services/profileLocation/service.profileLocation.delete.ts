import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const deleteLocationsOfProfile = async (
    profileId: string,
    locationIds: Array<string>
) => {
    try {
        logging.info("Delete locations of profie service start ...");

        let query =
            "DELETE FROM profiles_locations WHERE account_id = ? AND location_id in ";
        let params: Array<string | number> = [profileId];
        locationIds.forEach((locationId, index) => {
            query += index === 0 ? "(?" : ", ?";
            query += index === locationIds.length - 1 ? ")" : "";
            params = [...params, locationId];
        });

        const res = await executeQuery(query, params);
        return res.affectedRows === locationIds.length;
    } catch (error) {
        logging.error("Delete locations of profie service has error: ", error);
        throw error;
    }
};

export default deleteLocationsOfProfile;
