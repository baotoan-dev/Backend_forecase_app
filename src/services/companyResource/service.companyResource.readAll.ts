import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readAllCompaniesResourceService = async () => {
    try {
        logging.info("Read all job types service start ...");
        const query = "SELECT " +
        "id, name " +
        "FROM company_resource";
        const res = await executeQuery(query);
        return res ? res : null;
    } catch (error) {
        logging.error("Read all job types service has error: ", error);
        throw error;
    }
};

export default readAllCompaniesResourceService;
