import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const getLastOtpByPhoneNumberService = async (phone: String) => {
    try {
        logging.info("Get last otp by phone number service start: ", phone);
        const query =
            "SELECT otps.otp, otps.created_at " +
            "FROM otps, accounts " +
            "WHERE accounts.phone=? AND accounts.id=otps.account_id " +
            "ORDER BY otps.created_at DESC " +
            "LIMIT 1";
        const params = [phone];
        const res = await executeQuery(query, params);
        return res[0];
    } catch (error) {
        logging.error("Get last otp by phone service has error: ", error);
        throw error;
    }
};

export default getLastOtpByPhoneNumberService;
