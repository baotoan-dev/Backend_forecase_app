import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readDistrictsByProvince = async (provinceId: number, lang: string) => {
    try {
        const query = "SELECT id, name,full_name_en, " +
        `${lang === "en" || lang === "ko" ? "full_name_en as full_name " : "full_name as full_name"}` +
        " FROM districts WHERE province_id = ?";
        const params = [provinceId];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error("Read districts by province has error: ", error);
        throw error;
    }
};

export default readDistrictsByProvince;
