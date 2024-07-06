import { executeQuery } from "../../../configs/database/database";
import logging from "../../../utils/logging";

const readAllPostByStatusOfApply = async (status: number, accountId: string) => {
    try {
        logging.info('Read all post by status of apply service start ...');

        const query = `SELECT posts.id from posts INNER JOIN applications ON posts.id = applications.post_id WHERE applications.status = ? AND posts.account_id = ?`;

        const res = await executeQuery(query, [status, accountId]);

        return res ? res : null;
    } catch (error) {
        
    }
}

export default readAllPostByStatusOfApply;