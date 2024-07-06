import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createAccountWithPhoneService = async (id: String, phone: String) => {
    try {
        logging.info("Create account with phone service start: ", phone);
        const res = await executeQuery(
            "INSERT INTO accounts (id, phone) VALUES (?, ?)",
            [id, phone]
        );
        // console.log(res);
        return res.affectedRows === 1;
    } catch (error) {
        logging.error("Create account with phone service has error: ", error);
        throw error;
    }
};

export default createAccountWithPhoneService;
