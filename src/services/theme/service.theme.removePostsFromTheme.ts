import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const removePostsFromTheme = async (themeId: number, postIds: number[]) => {
    try {
        logging.info("Remove posts from theme service start ...");
        let query =
            "DELETE FROM themes_posts WHERE theme_id = ? AND post_id IN ";
        let params = [themeId];

        postIds.forEach((postId, index) => {
            query += index === 0 ? "(?" : ", ?";
            params = [...params, postId];
        });

        query += ")";

        const res = await executeQuery(query, params);
        return res ? res.affectedRows === postIds.length : false;
    } catch (error) {
        logging.error("Remove posts from theme service has error: ", error);
        throw error;
    }
};

export default removePostsFromTheme;
