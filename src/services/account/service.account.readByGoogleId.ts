import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const readAccountByGoogleIdService = async (googleId: String) => {
    try {
        logging.info("Read account by google id service start: ", googleId);
        const res = await executeQuery(
            "SELECT * FROM accounts WHERE gg_id = ?",
            [googleId]
        );
        return res[0];
    } catch (error) {
        logging.error("Read account by google id service has error: ", error);
        throw error;
    }
};

export default readAccountByGoogleIdService;
