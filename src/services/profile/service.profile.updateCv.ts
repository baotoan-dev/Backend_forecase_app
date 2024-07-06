import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const updateCV = async (profileId: string, cvUrl: string) => {
    try {
        logging.info("Update cv of profile service start ...");
        const query = "UPDATE profiles SET cv_url = ? WHERE id = ?";
        const params = [cvUrl, profileId];
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

export default updateCV;
