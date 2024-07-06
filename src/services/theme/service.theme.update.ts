import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const updateTheme = async (
    themeId: number,
    title: string,
    image: string,
    districtId: string = null
) => {
    try {
        logging.info("Update theme service start ...");
        const query = "UPDATE themes SET title = ?, image = ?, district_id = ? WHERE id = ?";
        const params = [title, image, districtId, themeId];
        const res = await executeQuery(query, params);
        return res ? res.affectedRows === 1 : false;
    } catch (error) {
        logging.error("Update theme service has error: ", error);
        throw error;
    }
};

export default updateTheme;
