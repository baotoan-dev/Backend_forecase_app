import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createAccountWithFacebookIdService = async (id: string, facebookId: String) => {
    try {
        logging.info("Create account with facebook id service start: ", facebookId);
        const res = await executeQuery(
            "INSERT INTO accounts (id, fb_id, is_active) VALUES (?, ?, ?)",
            [id, facebookId, 1]
        );
        // console.log(res);
        return res.affectedRows === 1;
    } catch (error) {
        logging.error(
            "Create account with facebook id service has error: ",
            error
        );
        throw error;
    }
};

export default createAccountWithFacebookIdService;
