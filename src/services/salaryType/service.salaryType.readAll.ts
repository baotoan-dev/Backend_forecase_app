import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readAllSalaryTypes = async (lang: string) => {
    try {
        logging.info("Read all salary types service start ...");
        const query = "SELECT " +
        "id, " +
        `${lang === "vi" ? "value" : lang === "en" ? "value_en" : "value_ko"} as value ` +
        "FROM salary_types";
        const res = await executeQuery(query);
        return res ? res : null;
    } catch (error) {
        logging.error("Read all salary types service has error: ", error);
        throw error;
    }
};

export default readAllSalaryTypes;
