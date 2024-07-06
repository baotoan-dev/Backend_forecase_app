import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const getLastOtpByEmailService = async (email: String) => {
    try {
        const query =
            "SELECT otp, created_at, account, type " +
            "FROM otps " +
            "WHERE account = ? AND type = 1 " +
            "ORDER BY otps.created_at DESC " +
            "LIMIT 1";
        const params = [email];
        const res = await executeQuery(query, params);
        return res ? res[0] : null;
    } catch (error) {
        logging.error("Get last otp by email service has error: ", error);
        throw error;
    }
};

export default getLastOtpByEmailService;
