import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const createTheme = async (title: string, image: string) => {
    try {
        logging.info("Create theme service start ...");
        const query =
            "INSERT INTO themes (title, image, status) VALUES (?, ?, ?)";
        const params = [title, image, 1];
        const res = await executeQuery(query, params);
        return res ? Number(res.insertId) : null;
    } catch (error) {
        logging.error("Create theme service has error: ", error);
        throw error;
    }
};

export default createTheme;
