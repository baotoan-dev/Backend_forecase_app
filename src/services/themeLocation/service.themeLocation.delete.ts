import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const deleteThemeLocations = async (themeId: number, districtIds: string[]) => {
    try {
        logging.info("Delete theme locations service start ...");
        let query =
            "DELETE FROM theme_locations WHERE theme_id = ? AND district_id IN  ";
        let params: Array<number | string> = [themeId];
        districtIds.forEach((districtId, index) => {
            query += index === 0 ? "(?" : ", ?";
            params = [...params, districtId];
        });
        query += ")";
        const res = await executeQuery(query, params);
        return res && res.affectedRows === districtIds.length;
    } catch (error) {
        logging.error("Delete theme locations service has error: ", error);
        throw error;
    }
};

export default deleteThemeLocations;
