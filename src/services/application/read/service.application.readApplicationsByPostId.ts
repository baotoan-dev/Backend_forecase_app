import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const readApplicationsByPostIdService = async (postId, limit = 10, page = 1) => {
    try {
        // Compute the offset for pagination
        const offset = (page - 1) * limit;

        // Prepare the query with limit and offset
        const query = `
            SELECT 
                applications.account_id, 
                applications.id, 
                applications.status as application_status, 
                applications.description,
                applications.name, 
                applications.avatar, 
                applications.birthday, 
                applications.address, 
                applications.gender, 
                applications.created_at, 
                provinces.full_name as province, 
                provinces.name as province_name,
                profiles.phone,
                profiles.email
            FROM applications
            LEFT JOIN provinces ON provinces.id = applications.address
            LEFT JOIN profiles ON profiles.id = applications.account_id
            WHERE applications.post_id = ?
            ORDER BY applications.id DESC
            LIMIT ? OFFSET ?`;

        // Execute the query with the parameters postId, limit, and offset
        const params = [postId, limit, offset];
        const res = await executeQuery(query, params);

        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read applications of post id service has error: ",
            error
        );
        throw error;
    }
}

export default readApplicationsByPostIdService;
