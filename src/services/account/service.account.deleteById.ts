import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const deleteAccountByIdService = async (id: String) => {
    try {
        logging.info("Delete account service ...");
        const res = await executeQuery(
            "DELETE FROM accounts WHERE id = ?",
            [id]
        );
        // console.log(res);
        return res.affectedRows === 1;
    } catch (error) {
        logging.error("Delete account service ...: ", error);
        throw error;
    }
};

export default deleteAccountByIdService;
