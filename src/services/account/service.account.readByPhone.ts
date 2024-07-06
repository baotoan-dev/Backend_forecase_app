import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const readAccountByPhoneNumberService = async (phone: String) => {
    try {
        logging.info("Read account by phone service start: ", phone);
        const readAccountByEmailRes = await executeQuery(
            "SELECT * FROM accounts WHERE phone = ?",
            [phone]
        );
        return readAccountByEmailRes[0];
    } catch (error) {
        logging.error("Read account by phone service has error: ", error);
        throw error;
    }
};

export default readAccountByPhoneNumberService;
