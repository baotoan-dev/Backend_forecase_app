import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const updateMessagesStatusToSeen = async (
    senderId: string,
    receiverId: string,
    // postId: number,
    status: number
) => {
    try {
        logging.info("Update messages status service start ...");

        let query =
            "UPDATE chats SET status = ? WHERE sender_id = ? AND receiver_id = ?";
        let params = [status, senderId, receiverId];

        await executeQuery(query, params);
    } catch (error) {
        logging.error("Update messages status service has error: ", error);
        throw error;
    }
};

export default updateMessagesStatusToSeen;
