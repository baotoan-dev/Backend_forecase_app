import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const updateIsActiveWithFacebookIdService = async (facebookId: String) => {
    try {
        logging.info("Create account with facebook id service start: ", facebookId);
        const query = "UPDATE accounts SET is_active = ? WHERE fb_id = ?";
        const params = [1, facebookId];
        
        const res = await executeQuery(query, params);

        return res ? true : false;
    } catch (error) {
        logging.error(
            "Create account with facebook id service has error: ",
            error
        );
        throw error;
    }
};

export default updateIsActiveWithFacebookIdService;
