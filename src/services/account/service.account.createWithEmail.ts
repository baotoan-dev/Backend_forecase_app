import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createAccountWithEmailService = async (
    id: String,
    email: String,
    ggId: String = null,
    role: number = 0
) => {
    try {
        // This function is used in src/controllers/signIn/emailAndGoogle/utils/createAccountWithEmail.ts
        // create account with email and ggId
        logging.info("Create account with email service start: ", email);
        const res = await executeQuery(
            "INSERT INTO accounts (id, email, gg_id, role) VALUES (?, ?, ?, ?)",
            [id, email, ggId, role]
        );
        
        return res.affectedRows === 1; // return true if create account success
    } catch (error) {
        logging.error("Create account with email service has error: ", error);
        throw error;
    }
};

export default createAccountWithEmailService;
