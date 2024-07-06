import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const createRateForApplicationService = async (applicationId: number, rate: number, comment: string | null) => {
    try {
        logging.info('Create rate for application service start ...');
        const query = 
        "INSERT INTO applications_rate (application_id, rating, comment) " +
        "VALUES (?, ?, ?) ";
        const params = [applicationId, rate, comment];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Create rate for application service has error: ",
            error
        );
        throw error;
    }
}

export default createRateForApplicationService;