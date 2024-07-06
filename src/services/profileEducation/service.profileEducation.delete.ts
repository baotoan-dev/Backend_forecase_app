import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const deleteEducationOfProfile = async (educationId: number) => {
    try {
        logging.info("Delete education of profie service start ...");

        const query = "DELETE FROM profiles_educations WHERE id = ?";
        const params = [educationId];

        const res = await executeQuery(query, params);
        return res.affectedRows === 1;
    } catch (error) {
        logging.error("Delete education of profie service has error: ", error);
        throw error;
    }
};

export default deleteEducationOfProfile;
