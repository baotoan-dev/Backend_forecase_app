import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readCategoriesOfPost = async (lang: string | null = "vi", postId: number) => {
    try {
        // logging.info("Read categories of post service start ...");
        const query = `
            SELECT
                posts_categories.category_id as child_category_id,
                ${lang === "vi" ? "parent_categories.name" 
                    : lang === "en" ? "parent_categories.name_en" 
                    : "parent_categories.name_kor"} as parent_category,
                ${lang === "vi" ? "child_categories.name" 
                    : lang === "en" ? "child_categories.name_en" 
                    : "child_categories.name_kor"} as child_category,
                child_categories.parent_category_id,
                parent_categories.default_post_image
            FROM posts_categories
            LEFT JOIN child_categories
            ON child_categories.id = posts_categories.category_id
            LEFT JOIN parent_categories
            ON parent_categories.id = child_categories.parent_category_id
            WHERE posts_categories.post_id = ?
        `
        const params = [postId];
        // console.log("query: ", query);
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error("Read categories of post service has error: ", error);
        throw error;
    }
};

export default readCategoriesOfPost;
