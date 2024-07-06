import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readAllWelcomeImages = async () => {
    try {
        logging.info("Read all salary types service start ...");
        const query = "SELECT * " +
        "FROM welcome_images WHERE status = 1";
        const res = await executeQuery(query);
        return res ? res : null;
    } catch (error) {
        logging.error("Read all salary types service has error: ", error);
        throw error;
    }
};

export default readAllWelcomeImages;
