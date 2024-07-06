import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const deleteCategoriesOfProfile = async (
    profileId: string,
    categoryIds: Array<number>
) => {
    try {
        logging.info("Delete categories of profie service start ...");

        let query =
            "DELETE FROM profiles_categories WHERE account_id = ? AND category_id in ";
        let params: Array<string | number> = [profileId];
        categoryIds.forEach((categoryId, index) => {
            query += index === 0 ? "(?" : ", ?";
            query += index === categoryIds.length - 1 ? ")" : "";
            params = [...params, categoryId];
        });

        const res = await executeQuery(query, params);
        return res.affectedRows === categoryIds.length;
    } catch (error) {
        logging.error("Delete categories of profie service has error: ", error);
        throw error;
    }
};

export default deleteCategoriesOfProfile;
