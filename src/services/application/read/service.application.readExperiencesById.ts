import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const readApplicationExperiencesByIdService = async (applicationId: number) => {
    try {
        logging.info("Read application experiences service start ...");
        const query = "SELECT * FROM applications_experiences WHERE application_id = ?";
        const params = [applicationId];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read application experiences service has error: ",
            error
        );
        return null;
    }
}

export default readApplicationExperiencesByIdService;