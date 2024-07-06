import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const deleteApplicationExperiencesService = async (applicationId: number) => {
    try {
        logging.info("Delete application experiences service start ...");
        const query = "DELETE FROM applications_experiences WHERE application_id = ?";
        const params = [applicationId];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Delete application experiences service has error: ",
            error
        );
        return null;
    }
}

export default deleteApplicationExperiencesService;