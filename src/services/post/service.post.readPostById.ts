import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { expiredDateCondition, initQueryReadDetailPost } from "./_service.post.initQuery";

const readPostByIdService = async (postId: number, lang: string | null = "vi",) => {
    try {
        logging.info("Read post by id service start ...");
        const query =
            initQueryReadDetailPost(lang) +
            "LEFT JOIN companies ON companies.account_id = posts.account_id " +
            "LEFT JOIN company_sizes ON company_sizes.id = companies.company_size_id " +
            "WHERE posts.id = ? " +
            // expiredDateCondition() +
            "GROUP BY posts.id";

        const params = [postId];
        const res = await executeQuery(query, params);

        // console.log("res: ", res);
        return res ? res : null;
    } catch (error) {
        logging.error("Read post by id service has error: ", error);
        throw error;
    }
};

export default readPostByIdService;
