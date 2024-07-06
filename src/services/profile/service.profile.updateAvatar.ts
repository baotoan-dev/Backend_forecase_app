import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const updateAvatar = async (profileId: string, avatarUrl: string) => {
    try {
        logging.info("Update avatar of profile service start ...");
        const query = "UPDATE profiles SET avatar = ? WHERE id = ?";
        const params = [avatarUrl, profileId];
        const res = await executeQuery(query, params);
        if (res) {
            return res.affectedRows === 1;
        }
        return false;
    } catch (error) {
        logging.error("Update avatar of profile service has error: ", error);
        throw error;
    }
};

export default updateAvatar;
