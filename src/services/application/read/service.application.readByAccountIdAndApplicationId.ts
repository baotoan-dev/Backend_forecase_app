import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const readApplicationByAccountIdAndApplicationIdService = async (accountId: number, applicationId: number) => {
    try {
        logging.info("Read application by account id and application id service start ...");
        const query = "SELECT * FROM applications WHERE account_id = ? AND id = ? GROUP BY applications.post_id";
        const params = [accountId, applicationId];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read application by account id and application id service has error: ",
            error
        );
        return null;
    }
}

export default readApplicationByAccountIdAndApplicationIdService;