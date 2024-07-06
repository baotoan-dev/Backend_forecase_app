import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readEnabledThemes = async (
    provinces: string[] = [],
) => {
    try {
        logging.info("Read enabled themes service start ...");
        // Each theme I want to get all posts have district_id = themes.district_id 
        // But post just have ward_id, so I need to get district_id from ward_id
        let query =
            "SELECT themes.id, " +
            "themes.title, " +
            "themes.image, " +
            "themes.district_id, " +
            "COUNT(posts.id) AS number_of_posts " +
            "FROM themes " +
            "LEFT JOIN wards " +
            "ON wards.district_id = themes.district_id " +
            "LEFT JOIN districts " +
            "ON districts.id = wards.district_id " +
            "LEFT JOIN posts " +
            "ON posts.ward_id = wards.id " +
            "WHERE themes.status = ? AND posts.status = 1 " +
            `${provinces.length > 0 ? "AND districts.province_id IN " +
            "(" + provinces.map((_) => "?").join(", ") + ")" : ""}` +
            "GROUP BY themes.id";
        // console.log(query)
        let params = [1, ...provinces];

        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error("Read enabled themes service has error: ", error);
        throw error;
    }
};

export default readEnabledThemes;
