import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const rejectApplicationByPostIdService = async (postId: number, status: number) => {
    try {
        logging.info("Update application by id service start ...");
        const query = "UPDATE applications SET status = ? WHERE post_id = ? and status != 4";
        const params = [status, postId];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Update application by id service has error: ",
            error
        );
        return null;
    }
}

export default rejectApplicationByPostIdService;