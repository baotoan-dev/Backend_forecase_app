import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createAccountWithGoogleIdService = async (id, googleId: String) => {
    try {
        logging.info("Create account with google id service start: ", googleId);
        const res = await executeQuery(
            "INSERT INTO accounts (id, gg_id) VALUES (?, ?)",
            [id, googleId]
        );
        // console.log(res);
        return res.affectedRows === 1;
    } catch (error) {
        logging.error(
            "Create account with google id service has error: ",
            error
        );
        throw error;
    }
};

export default createAccountWithGoogleIdService;
