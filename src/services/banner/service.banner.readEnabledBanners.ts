import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readEnabledBanners = async (version: number) => {
    try {
        logging.info("Read enabled banners service start ...");
        const query =
            "SELECT id, image, redirect_url, type from banners WHERE status = ? AND version = ? ORDER BY ID DESC";
        const params = [1, version];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error("Read enabled banners service has error: ", error);
        throw error;
    }
};

export default readEnabledBanners;
