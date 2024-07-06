import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const getUnreadChatsService = async (
    account_id: string,
) => {
    try {
        logging.info("Get unread chats service start ...");
        const query =
            "SELECT COUNT(*) as quantity FROM chats WHERE receiver_id = ? AND status = 0";
        const params = [account_id];
        const res = await executeQuery(query, params);
        return res[0].quantity;
    } catch (error) {
        logging.error("Get unread chats service has error: ", error);
        throw error;
    }
};

export default getUnreadChatsService;
