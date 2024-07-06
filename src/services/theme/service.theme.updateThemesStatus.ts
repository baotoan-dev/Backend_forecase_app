import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const updateThemesStatus = async (themeIds: number[], status: number) => {
    try {
        logging.info("Update themes status service start ...");
        let query = "UPDATE themes SET status = ? WHERE id in (";
        let params = [status];

        themeIds.forEach((themeId, index) => {
            query += index === 0 ? "?" : ", ?";
            params = [...params, themeId];
        });
        query += ")";

        const res = await executeQuery(query, params);
        return res ? res.affectedRows === themeIds.length : false;
    } catch (error) {
        logging.error("Update themes status service has error: ", error);
        throw error;
    }
};

export default updateThemesStatus;
