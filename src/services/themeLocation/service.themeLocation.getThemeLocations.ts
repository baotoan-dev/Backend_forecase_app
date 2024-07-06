import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const getThemeLocations = async (themeId: number) => {
    try {
        logging.info("Get theme locations service start ...");
        const query =
            "SELECT districts.id AS district_id, districts.name AS district, " +
            "provinces.id AS province_id, provinces.name AS province " +
            "FROM theme_locations, districts, provinces " +
            "WHERE theme_locations.theme_id = ? AND theme_locations.district_id = districts.id  " +
            "AND districts.province_id = provinces.id";
        const params = [themeId];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error("Get theme locations service has error: ", error);
        throw error;
    }
};

export default getThemeLocations;
