import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const deleteCategoriesOfPostByIds = async (
    postId: number,
    categoryIds: Array<number>
) => {
    try {
        logging.info("Create categories of post service start ...");
        let query =
            "DELETE FROM posts_categories WHERE post_id = ? AND category_id in ";
        let params = [postId];
        categoryIds.forEach((categoryId, index) => {
            query += index === 0 ? "(?" : ", ?";
            query += index === categoryIds.length - 1 ? ")" : "";
            params = [...params, categoryId];
        });

        const res = await executeQuery(query, params);
        return res ? res.affectedRows === categoryIds.length : false;
    } catch (error) {
        logging.error("Create categories of post service has error: ", error);
        throw error;
    }
};

export default deleteCategoriesOfPostByIds;
