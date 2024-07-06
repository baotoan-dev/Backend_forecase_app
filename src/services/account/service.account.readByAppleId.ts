import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const readAccountByAppleIdService = async (appleId: string) => {
    try {
        logging.info("Read account by apple id service start: ", appleId);
        const res = await executeQuery(
            "SELECT * FROM accounts WHERE apple_id = ?",
            [appleId]
        );
        return res[0];
    } catch (error) {
        logging.error("Read account by apple id service has error: ", error);
        throw error;
    }
};

export default readAccountByAppleIdService;
