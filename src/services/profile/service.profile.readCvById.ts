import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readCVProfileById = async (id: string) => {
    try {
        const query = "SELECT profiles_cvs.id, profiles_cvs.path, profiles_cvs.image FROM profiles INNER JOIN profiles_cvs ON profiles.id = profiles_cvs.account_id WHERE profiles.id = ?";

        const params = [id];

        const res = await executeQuery(query, params);

        return res;
    } catch (error) {
        logging.error("Read CV profile by id service has error: ", error);
        throw error;
    }
}

export default readCVProfileById;