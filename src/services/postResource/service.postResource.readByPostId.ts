import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const readPostResourceService = async (
    post_id: number
) => {
    try {
        const query = "SELECT * from post_resource where post_id = ?";
        const params = [post_id];
        const res = await executeQuery(query, params);
        return res[0];
    } catch (error) {
        throw error;
    }
};

export default readPostResourceService;
