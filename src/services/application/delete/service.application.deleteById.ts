import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const deleteApplicationService = async (applicationId: number) => {
    try {
        logging.info("Delete application service start ...");
        const query = "DELETE FROM applications WHERE id = ?";
        const params = [applicationId];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Delete application service has error: ",
            error
        );
        return null;
    }
}

export default deleteApplicationService;