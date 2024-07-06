import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { initQueryReadPost } from "./_service.post.initQuery";

const readAllPostsByAccountIdService = async (
    lang: string = "vi",
    accountId: string,
    threshold: number | null,
    limit: number | null
    ) => {
    try {
        logging.info("Read all posts by account id service start ...");
        const query = 
        initQueryReadPost(lang) +
        "WHERE posts.account_id = ? " +
        `${threshold ? "AND posts.id < ? " : ""}` +
        "GROUP BY posts.id " +
        "ORDER BY posts.id DESC" +
        `${limit ? " LIMIT ?" : ""}`;
        const params = threshold ? [accountId, threshold, limit] : [accountId, limit];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read all posts by account id service has error: ",
            error
        );
        return null;
    }
}

export default readAllPostsByAccountIdService;