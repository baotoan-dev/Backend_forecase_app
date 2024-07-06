import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const readAccountByIdService = async (uid: string) => {
    try {
        logging.info("Read account by apple id service start: ", uid);
        const res = await executeQuery(
            "SELECT * FROM accounts WHERE id = ?",
            [uid]
        );
        return res[0];
    } catch (error) {
        logging.error("Read account by apple id service has error: ", error);
        throw error;
    }
};

export default readAccountByIdService;
