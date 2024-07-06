import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createAccountWithAppleIdService = async (id, appleId: String) => {
    try {
        logging.info("Create account with apple id service start: ", appleId);
        const res = await executeQuery(
            "INSERT INTO accounts (id, apple_id) VALUES (?, ?)",
            [id, appleId]
        );
        // console.log(res);
        return res.affectedRows === 1;
    } catch (error) {
        logging.error(
            "Create account with apple id service has error: ",
            error
        );
        throw error;
    }
};

export default createAccountWithAppleIdService;
