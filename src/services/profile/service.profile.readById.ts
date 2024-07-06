import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readProfileByIdService = async (
    lang: string,
    profileId: string
) => {
    try {
        logging.info("Read profile by id service start ...");
        const query =
            "SELECT * FROM profiles " +
            "WHERE profiles.account_id = ?";
        const params = [profileId];
        const res = await executeQuery(query, params);
        return res ? res[0] : null;
    } catch (error) {
        logging.error("Read profile by id service has error: ", error);
        throw error;
    }
};

export default readProfileByIdService;
