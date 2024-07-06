import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const readActiveAccountByEmailService = async (id: String) => {
    try {
        logging.info("Read account by email service start: ", id);
        const readAccountByEmailRes = await executeQuery(
            "SELECT id, is_active FROM accounts WHERE id = ?",
            [id]
        );

        console.log("readAccountByEmailRes: ", readAccountByEmailRes);
        return readAccountByEmailRes ? readAccountByEmailRes[0] : null;
    } catch (error) {
        logging.error("Read account by email service has error: ", error);
        throw error;
    }
};

export default readActiveAccountByEmailService;
