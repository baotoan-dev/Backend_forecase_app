import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const updateAvatar = async (profileId: string, avatarUrl: string) => {
    try {
        logging.info("Update avatar of profile service start ...");

        if (typeof profileId !== 'string') {
            throw new Error('profileId must be a string');
        }

        const query = "UPDATE profiles SET avatar = ? WHERE account_id = ?";
        const params = [avatarUrl, profileId];
        const res = await executeQuery(query, params);

        if (res && res.affectedRows === 1) {
            return true; 
        } else {
            return false; 
        }
    } catch (error) {
        logging.error("Update avatar of profile service has error: ", error);
        throw error; 
    }
};

export default updateAvatar;
