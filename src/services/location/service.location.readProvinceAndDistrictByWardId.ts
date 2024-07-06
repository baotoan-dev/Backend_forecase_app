import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readProvinceAndDistrictByWardIdService = async (wardId: number) => {
    try {
        const query = `
            SELECT 
                wards.id AS ward_id, 
                wards.full_name AS ward_name, 
                wards.district_id AS ward_district_id,
                districts.id AS district_id, 
                districts.full_name AS district_name, 
                districts.province_id AS district_province_id,
                provinces.id AS province_id, 
                provinces.full_name AS province_name
            FROM wards 
            INNER JOIN districts ON wards.district_id = districts.id 
            INNER JOIN provinces ON districts.province_id = provinces.id 
            WHERE wards.id = ?`;
        const params = [wardId];
        const res = await executeQuery(query, params);
        return res ? res[0] : null;
    } catch (error) {
        logging.error("Read province and district by ward id has error: ", error);
        throw error;
    }
};

export default readProvinceAndDistrictByWardIdService;
