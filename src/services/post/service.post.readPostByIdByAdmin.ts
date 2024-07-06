import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { initQueryReadDetailPost } from "./_service.post.initQuery";

const readPostByIdByAdminService = async (postId: number, lang: string = "vi",) => {
    try {
        logging.info("Read post by id service start ...");
        const query =
            initQueryReadDetailPost(lang) +
            "WHERE posts.id = ?";
        const params = [postId];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error("Read post by id service has error: ", error);
        throw error;
    }
};

export default readPostByIdByAdminService;
