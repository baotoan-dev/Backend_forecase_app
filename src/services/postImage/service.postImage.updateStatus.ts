import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const updateStatus = async (imageIds: Array<number>, status: number) => {
    try {
        logging.info("Update images status of post service start ...");
        let query = "UPDATE post_images SET status = ? WHERE id IN ";
        const params = [status];
        imageIds.forEach((imageId, index) => {
            query += index === 0 ? "(?" : ", ?";
            params.push(imageId);
        });
        query += ")";
        // console.log(query);
        await executeQuery(query, params);
    } catch (error) {
        logging.error(
            "Update images status of post service has error: ",
            error
        );
        throw error;
    }
};

export default updateStatus;
