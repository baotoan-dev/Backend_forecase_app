import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const updatePostResourceService = async (
    post_id: number,
    url: string,
    company: number
) => {
    try {
        logging.info("Update post resource service start");
        const query = "UPDATE post_resource SET url = ?, company = ? WHERE post_id = ?";
        const params = [url, company, post_id];
        const res = await executeQuery(query, params);
        return res.affectedRows;
    } catch (error) {
        logging.error("Update post resource service has error: ", error);
        throw error;
    }
};

export default updatePostResourceService;
