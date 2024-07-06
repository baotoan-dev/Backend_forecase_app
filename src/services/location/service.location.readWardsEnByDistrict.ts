import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readWardsEnByDistrict = async (provinceId: number) => {
    try {
        const query = "SELECT id, full_name_en as full_name FROM wards WHERE district_id = ?";
        const params = [provinceId];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error("Read districts by province has error: ", error);
        throw error;
    }
};

export default readWardsEnByDistrict;
