import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const createApplicationLocationsService = async (applicationId: number, accountId: string) => {
    try {
        logging.info("Create application LOCATIONS service start ...");
        const query = "INSERT INTO applications_locations (application_id, location_id)" +
        " SELECT ?, profiles_locations.location_id from profiles_locations WHERE profiles_locations.account_id = ?";
        const params = [applicationId, accountId];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Create application LOCATIONS service has error: ",
            error
        );
        return null;
    }
}

export default createApplicationLocationsService;