import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const readAccountByFacebookIdService = async (facebookId: String) => {
    try {
        logging.info("Read account by facebook id service start: ", facebookId);
        const res = await executeQuery(
            "SELECT * FROM accounts WHERE fb_id = ?",
            [facebookId]
        );
        return res[0];
    } catch (error) {
        logging.error("Read account by facebook id service has error: ", error);
        throw error;
    }
};

export default readAccountByFacebookIdService;
