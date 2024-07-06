import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createProfileWithAccountIdService = async (accountId: string, phone: string = null, name: string = null) => {
    try {
        logging.info(
            "Create profile with account id service start: ",
            accountId
        );
        const res = await executeQuery("INSERT INTO profiles (account_id, phone, name, avatar) VALUES (?, ?, ?, ?)", [
            accountId,
            phone,
            name,
            "",
        ]);
        // console.log(res);
        return res.affectedRows === 1;
    } catch (error) {
        logging.error(
            "Create profile with account id service has error: ",
            error
        );
        throw error;
    }
};

export default createProfileWithAccountIdService;
