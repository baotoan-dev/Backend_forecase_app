import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const updateContactInformation = async (
    id: string,
    phone: string,
    email: string,
    facebook: string = null,
    linkedin: string = null
) => {
    try {
        logging.info("Update contact information of profile service start ...");
        const query =
            "UPDATE profiles " +
            "SET phone = ?, email = ? , facebook = ?, linkedin = ? " +
            "WHERE id = ?";
        const params = [phone, email, facebook, linkedin, id];
        const res = await executeQuery(query, params);
        return res ? res.affectedRows === 1 : false;
    } catch (error) {
        logging.error(
            "Update contact information of profile service has error: ",
            error
        );
        throw error;
    }
};

export default updateContactInformation;
