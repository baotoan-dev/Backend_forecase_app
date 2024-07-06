import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readAllBanners = async () => {
    try {
        logging.info("Read all banners service start ...");
        const query = "SELECT * from banners ORDER BY ID DESC";
        const res = await executeQuery(query);
        return res ? res : null;
    } catch (error) {
        logging.error("Read all banners service has error: ", error);
        throw error;
    }
};

export default readAllBanners;
