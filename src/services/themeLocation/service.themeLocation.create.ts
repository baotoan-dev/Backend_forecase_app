import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createThemeLocations = async (themeId: number, districtIds: string[]) => {
    try {
        logging.info("Create theme locations service start ...");
        let query =
            "INSERT INTO theme_locations (theme_id, district_id) VALUES ";
        let params = [];
        districtIds.forEach((districtId, index) => {
            query += index === 0 ? "(?, ?)" : ", (?, ?)";
            params = [...params, themeId, districtId];
        });
        const res = await executeQuery(query, params);
        return res && res.affectedRows === districtIds.length;
    } catch (error) {
        logging.error("Create theme locations service has error: ", error);
        throw error;
    }
};

export default createThemeLocations;
