import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { initQueryReadPost } from "./_service.post.initQuery";

const readAllPostsByTheme = async (themeId: number, lang: string = "vi",) => {
    try {
        logging.info("Read all posts by theme service start ...");
        const query =
            initQueryReadPost(lang) + 
            "WHERE posts.status = 1 AND posts.id IN (SELECT post_id FROM themes_posts WHERE theme_id = ?) " +
            "GROUP BY posts.id ORDER BY posts.id DESC";

        const params = [themeId];

        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error("Read all posts by theme service has error: ", error);
        throw error;
    }
};

export default readAllPostsByTheme;
