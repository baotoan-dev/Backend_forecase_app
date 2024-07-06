import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { initQueryReadPost } from "./_service.post.initQuery";

    const readAcceptedPostsByAccountId = async (accountId: string, lang: string = "vi",) => {
    try {
        logging.info("Read accepted posts by account id service start ...");
        const query =
            initQueryReadPost(lang) +
            "WHERE posts.account_id = ? AND posts.salary_type = salary_types.id " +
            "GROUP BY posts.id " +
            "ORDER BY posts.id DESC";
        const params = [accountId];
        const res = await executeQuery(query, params);
        return res ? res : false;
    } catch (error) {
        logging.error(
            "Read accepted posts by account id service has error: ",
            error
        );
        throw error;
    }
};

export default readAcceptedPostsByAccountId;
