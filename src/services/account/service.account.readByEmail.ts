import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const readAccountByEmailService = async (email: String) => {
    try {
        logging.info("Read account by email service start: ", email);
        const readAccountByEmailRes = await executeQuery(
            "SELECT * FROM accounts WHERE email = ?",
            [email]
        );
        return readAccountByEmailRes ? readAccountByEmailRes[0] : null;
    } catch (error) {
        logging.error("Read account by email service has error: ", error);
        throw error;
    }
};

export default readAccountByEmailService;
