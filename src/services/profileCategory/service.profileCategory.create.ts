import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createCategoriesOfProfile = async (
    profileId: string,
    categoryIds: Array<number>
) => {
    try {
        logging.info("Create categories of profie service start ...");

        let query =
            "INSERT INTO profiles_categories (account_id, category_id) VALUES ";
        let params = [];
        categoryIds.forEach((categoryId, index) => {
            if (index === 0) {
                query += "(?, ?)";
            } else {
                query += ",(?, ?)";
            }
            params = [...params, profileId, categoryId];
        });

        const createRes = await executeQuery(query, params);
        return createRes.affectedRows === categoryIds.length;
    } catch (error) {
        logging.error("Create categories of profie service has error: ", error);
        throw error;
    }
};

export default createCategoriesOfProfile;
