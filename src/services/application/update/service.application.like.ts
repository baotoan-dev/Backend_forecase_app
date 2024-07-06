import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const updateLikeStatusApplicationByIdService = async (applicationId: number, liked: number) => {
    try {
        logging.info("Update application by id service start ...");
        const query = "UPDATE applications SET liked = ? WHERE id = ?";
        const params = [liked.toString(), applicationId];
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

export default updateLikeStatusApplicationByIdService;