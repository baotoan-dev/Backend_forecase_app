import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createPostResourceService = async (
    post_id: number,
    url: string,
    company: number
) => {
    try {
        logging.info("Create post resource service start");
        const query = "INSERT INTO post_resource (post_id, url, company) VALUES (?, ?, ?)";
        const params = [post_id, url, company];
        const res = await executeQuery(query, params);
        return res.affectedRows === 1;
    } catch (error) {
        logging.error("Create post resource service has error: ", error);
        throw error;
    }
};

export default createPostResourceService;
