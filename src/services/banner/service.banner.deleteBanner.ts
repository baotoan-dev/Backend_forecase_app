import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const deleteBanner = async (idBanner) => {
    try {
        logging.info("Delete banner service start ...");
        const query = "DELETE FROM banners WHERE id = ?";
        const params = [idBanner];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Delete banner service has error: ",
            error
        );
        return null;
    }
};

export default deleteBanner;
