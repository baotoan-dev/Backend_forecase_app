import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const readApplicationByPostIdAndAccountIdService = async (postId: number, accountId: string) => {
    try {
        const query = "SELECT * FROM applications WHERE post_id = ? AND account_id = ?";
        const params = [postId, accountId];
        const res = await executeQuery(query, params);
        return res ? res[0] : null;
        
    } catch (error) {
        logging.error(
            "Read application by post id and account id service has error: ",
            error
        );
        throw error;
    }
}

export default readApplicationByPostIdAndAccountIdService;