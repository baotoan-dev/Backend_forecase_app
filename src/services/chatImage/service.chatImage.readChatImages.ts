import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const readChatImages = async (chatId: number) => {
    try {
        logging.info("Read chat images service start ...");
        const query = "SELECT id, image FROM chat_images WHERE chat_id = ?";
        const params = [chatId];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error("Read chat images service has error: ", error);
        throw error;
    }
};

export default readChatImages;
