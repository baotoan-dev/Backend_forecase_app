import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const getUsersChatted = async (
    lang: string,
    id: string
) => {
    try {
        logging.info("Get users chated service start ...");

        const query =
            "SELECT " +
            "t.*, " +
            "posts.title AS post_title, " +
            "profiles.name, " +
            "profiles.avatar, " +
            "profiles.phone, " +
            "posts.company_name, " +
            "posts.salary_min, " +
            "posts.salary_max, " +
            "posts.salary_type as salary_type_id, " +
            "posts.money_type, " +
            `${lang === "vi" ? "salary_types.value" : 
                lang === "en" ? "salary_types.value_en" : "salary_types.value_ko"
            } AS salary_type,` + 
            "post_images.image AS image, " +
            "applications.status AS application_status, " +
            "posts.account_id AS post_account_id, " +
            "posts.status AS post_status " +
            "FROM (select chats.* from chats " +
            "join " +
            "(select user, max(id) m from " +
            "((select id, receiver_id user from chats where sender_id=?) " +
            "union (select id, sender_id user from chats where receiver_id=?) " +
            ") t1 group by user) t2 " +
            "on ((sender_id=? and receiver_id=user) or " +
            "(sender_id=user and receiver_id=?)) and (id = m) " +
            "order by created_at DESC) AS t, profiles, posts " +
            "LEFT JOIN salary_types ON posts.salary_type = salary_types.id " +
            "LEFT JOIN post_images ON posts.id = post_images.post_id " +
            "LEFT JOIN applications ON posts.id = applications.post_id AND applications.account_id = ? " +
            "WHERE posts.id = t.post_id AND profiles.id = IF(t.sender_id = ?, t.receiver_id, t.sender_id) " +
            "GROUP BY t.id";
        const params = [id, id, id, id, id, id];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error("Get users chated service has error: ", error);
        throw error;
    }
};

export default getUsersChatted;
