import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const deleteAllThemeLocations = async (themeId: number) => {
    try {
        logging.info("Delete theme locations service start ...");
        const query = "DELETE FROM theme_locations WHERE theme_id = ?";
        const params = [themeId];
        await executeQuery(query, params);
    } catch (error) {
        logging.error("Delete theme locations service has error: ", error);
        throw error;
    }
};

export default deleteAllThemeLocations;
