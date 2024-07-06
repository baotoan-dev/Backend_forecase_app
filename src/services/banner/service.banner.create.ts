import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const createBanner = async (
    image: string,
    redirectUrl: string,
    type: number,
    version: number
) => {
    try {
        logging.info("Create banner service start ...");
        const query =
            "INSERT INTO banners (image, redirect_url, type, version) VALUES (?, ?, ?, ?)";
        const params = [image, redirectUrl, type, version];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? Number(res.insertId) : null;
    } catch (error) {
        logging.error("Create banner service has error: ", error);
        throw error;
    }
};

export default createBanner;
