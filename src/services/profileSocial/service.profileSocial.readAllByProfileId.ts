import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readProfileSocialsByIdService = async (profileId: string) => {
    try {
        logging.info("Read profile socials by id service start ...");
        const query =
            "SELECT type, url "+
            "FROM profiles_socials " +
            "WHERE account_id = ?";
        const params = [profileId];
        const res = await executeQuery(query, params);
        return res;
    } catch (error) {
        logging.error("Read profile socials by id service has error: ", error);
        throw error;
    }
};

export default readProfileSocialsByIdService;
