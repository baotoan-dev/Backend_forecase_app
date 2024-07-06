import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const deleteApplicationLocationsService = async (applicationId: number) => {
    try {
        logging.info("Delete application locations service start ...");
        const query = "DELETE FROM applications_locations WHERE application_id = ?";
        const params = [applicationId];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Delete application locations service has error: ",
            error
        );
        return null;
    }
}

export default deleteApplicationLocationsService;