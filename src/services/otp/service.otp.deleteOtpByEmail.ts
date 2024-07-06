import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const deleteOtpByEmailService = async (email: String) => {
    try {
        const query =
            "DELETE FROM otps " +
            "WHERE account = ? AND type = 1 AND status = 0 ";
        const params = [email];
        const res = await executeQuery(query, params);
        return res ? res[0] : null;
    } catch (error) {
        logging.error("Delete otp by email service has error: ", error);
        throw error;
    }
};

export default deleteOtpByEmailService;
