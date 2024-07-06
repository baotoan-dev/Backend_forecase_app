import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readAllThemes = async () => {
    try {
        logging.info("Read all themes service start ...");
        const query =
            "SELECT themes.id, themes.title, themes.image, themes.status " +
            "FROM themes " +
            "ORDER BY id DESC";
        const res = await executeQuery(query);
        return res ? res : null;
    } catch (error) {
        logging.error("Read all themes service has error: ", error);
        throw error;
    }
};

export default readAllThemes;
