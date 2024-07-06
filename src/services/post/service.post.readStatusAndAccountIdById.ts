import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readStatusAndAccountIdById = async (postId: number) => {
    try {
       
        const query = "SELECT status, account_id, title, company_name FROM posts WHERE id = ?";
        const params = [postId];
        const res = await executeQuery(query, params);
        return res ? res[0] : null;

    } catch (error) {
        logging.error(
            "Read status and account id by id service has error: ",
            error
        );
        throw error;
    }
};

export default readStatusAndAccountIdById;
