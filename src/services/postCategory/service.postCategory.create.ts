import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const createCategoriesOfPost = async (
    postId: number,
    categoryIds: Array<number>
) => {
    try {
        logging.info("Create categories of post service start ...");
        let query =
            "INSERT INTO posts_categories (post_id, category_id) VALUES ";
        let params = [];

        categoryIds.map((categoryId, index) => {
            query += index === 0 ? "(?,?)" : ",(?,?)";
            params = [...params, postId, categoryId];
        });

        const res = await executeQuery(query, params);
        return res ? res.affectedRows === categoryIds.length : false;
    } catch (error) {
        logging.error("Create categories of post service has error: ", error);
        throw error;
    }
};

export default createCategoriesOfPost;
