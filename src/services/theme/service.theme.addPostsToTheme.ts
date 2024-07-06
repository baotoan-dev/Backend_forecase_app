import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const addPostsToTheme = async (themeId: number, postIds: number[]) => {
    try {
        logging.info("Add posts to theme service start ...");
        let query = "INSERT INTO themes_posts (theme_id, post_id) VALUES ";
        let params = [];

        postIds.forEach((postId, index) => {
            query += index === 0 ? "(?, ?)" : ", (?, ?)";
            params = [...params, themeId, postId];
        });

        const res = await executeQuery(query, params);
        return res ? res.affectedRows === postIds.length : false;
    } catch (error) {
        logging.error("Add posts to theme service has error: ", error);
        throw error;
    }
};

export default addPostsToTheme;
