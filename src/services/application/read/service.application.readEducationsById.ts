import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const readApplicationEducationsByIdService = async (applicationId: number) => {
    try {
        logging.info("Read application educations service start ...");
        const query = "SELECT * FROM applications_educations WHERE application_id = ?";
        const params = [applicationId];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read application educations service has error: ",
            error
        );
        return null;
    }
}

export default readApplicationEducationsByIdService;