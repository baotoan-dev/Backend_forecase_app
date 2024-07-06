import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createProfileWithAccountIdService = async (accountId: string, email: string = null, phone: string = null, name: string = null, address: string = null, birthday: number = 86400000) => {
    try {
        logging.info(
            "Create profile with account id service start: ",
            accountId
        );
        const res = await executeQuery("INSERT INTO profiles (id, email, phone, name, address, birthday) VALUES (?, ?, ?, ?, ?, ?)", [
            accountId,
            email,
            phone,
            name,
            address,
            birthday
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
