import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createOtpService = async (otp: string, account: string, type: '1' | '2') => {
    try {
        logging.info("Create otp service start: ");
        const query = "INSERT INTO otps (account, otp, type) VALUES (?, ?, ?)";
        const params = [account, otp, type];
        const res = await executeQuery(query, params);
        return res.affectedRows === 1;
    } catch (error) {
        logging.error("Create otp service has error: ", error);
        throw error;
    }
};

export default createOtpService;
