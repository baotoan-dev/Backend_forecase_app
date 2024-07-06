import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const updateApplicationByIdService = async (applicationId: number, status: number, description?: string) => {
    try {
        logging.info("Update application by id service start ...");
        let query = "";
        let params = [];
        if (status === 3) {
            query = "UPDATE applications SET status = ?, description = ? WHERE id = ?";
            params = [status, description, applicationId];
        }
        else{
            query = "UPDATE applications SET status = ? WHERE id = ?";
            params = [status, applicationId];
        }

        const res = await executeQuery(query, params);

        return res ? res.affectedRows : null;
    } catch (error) {
        logging.error(
            "Update application by id service has error: ",
            error
        );
        return null;
    }
}

export default updateApplicationByIdService;