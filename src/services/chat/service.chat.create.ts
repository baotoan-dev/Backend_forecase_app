import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createChat = async (
    senderId: string,
    receiverId: string,
    type: string,
    message: string,
    postId: number,
    createdAt: number
) => {
    try {
        logging.info("Create chat service start ...");
        const query =
            "INSERT INTO chats (sender_id, receiver_id, type, message, post_id, created_at) VALUES (?, ?, ?, ?, ?, ?)";
        const params = [senderId, receiverId, type, message, postId, createdAt];
        const res = await executeQuery(query, params);
        return res ? Number(res.insertId) : null;
    } catch (error) {
        logging.error("Create chat service has error: ", error.message);
        throw error;
    }
};

export default createChat;
