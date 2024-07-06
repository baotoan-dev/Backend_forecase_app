import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const deleteExperienceOfProfile = async (id: number) => {
    try {
        logging.info("Delete experience of profie service start ...");

        const query = "DELETE FROM profiles_experiences WHERE id = ?";
        const params = [id];

        const res = await executeQuery(query, params);
        return res.affectedRows === 1;
    } catch (error) {
        logging.error("Delete experience of profie service has error: ", error);
        throw error;
    }
};

export default deleteExperienceOfProfile;
