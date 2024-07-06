import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readAllJobTypesService = async (lang: string = "vi") => {
    try {
        logging.info("Read all job types service start ...");
        const query = "SELECT " +
        "id, " +
        `${lang === "vi" ? "name" : lang === "en" ? "name_en" : "name_ko"} as name ` +
        "FROM job_types";
        const res = await executeQuery(query);
        return res ? res : null;
    } catch (error) {
        logging.error("Read all job types service has error: ", error);
        throw error;
    }
};

export default readAllJobTypesService;
