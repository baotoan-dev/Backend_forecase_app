import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const deleteApplicationEducationsService = async (applicationId: number) => {
    try {
        logging.info("Delete application educations service start ...");
        const query = "DELETE FROM applications_educations WHERE application_id = ?";
        const params = [applicationId];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Delete application educations service has error: ",
            error
        );
        return null;
    }
}

export default deleteApplicationEducationsService;