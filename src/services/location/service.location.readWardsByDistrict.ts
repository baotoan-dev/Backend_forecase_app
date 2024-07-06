import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readWardsByDistrictService = async (districtId: number, lang: string = "vi") => {
    try {
        const query = 
        "SELECT id, name,full_name_en, " +
        `${lang === "en" || lang === "ko" ? "full_name_en as full_name " : "full_name as full_name"}` +
        " FROM wards WHERE district_id = ?";
        const params = [districtId];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error("Read wards by districtId has error: ", error);
        throw error;
    }
};

export default readWardsByDistrictService;
