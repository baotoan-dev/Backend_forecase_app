import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const createChatImages = async (chatId: number, urls: string[]) => {
    try {
        logging.info("Create chat images service start ...");
        let query = "INSERT INTO chat_images(chat_id, image) VALUES ";
        let params = [];
        urls.forEach((url, index) => {
            query += index === 0 ? "(?, ?)" : ",(?, ?)";
            params = [...params, chatId, url];
        });
        const res = await executeQuery(query, params);
        return res ? res.affectedRows === urls.length : false;
    } catch (error) {
        logging.error("Create chat images service has error: ", error);
        throw error;
    }
};

export default createChatImages;
