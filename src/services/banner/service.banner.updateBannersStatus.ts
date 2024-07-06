import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const updateBannersStatus = async (bannerIds: number[], status: number) => {
    try {
        logging.info("Update banners status service start ...");
        let query = "UPDATE banners SET status = ? WHERE id in (";
        const params = [status];

        bannerIds.map((bannerId, index) => {
            query += index === 0 ? "?" : ", ?";
            params.push(bannerId);
        });
        query += ")";

        const res = await executeQuery(query, params);
        return res ? res.affectedRows === bannerIds.length : false;
    } catch (error) {
        logging.error(`Update banners status service has error: `, error);
        throw error;
    }
};

export default updateBannersStatus;
