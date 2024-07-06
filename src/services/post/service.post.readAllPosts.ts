import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readPostsService = async () => {
    try {
        logging.info("Read posts service start ...");
        const query =
            "SELECT posts.id, posts.status, posts.account_id, posts.title, posts.company_name, " +
            "posts.is_date_period, posts.start_date, posts.end_date, posts.start_time, " +
            "posts.end_time, posts.salary_min, posts.salary_max, posts.salary_type, posts.created_at, " +
            "provinces.name as province, provinces.id as province_id, districts.name as district, " +
            "districts.id as district_id, post_images.image AS image, profiles.name as poster, posts.money_type, " +
            "posts.salary_type as salary_type_id " +
            "FROM posts " +
            "LEFT JOIN districts " +
            "ON districts.id = posts.district_id " +
            "LEFT JOIN provinces " +
            "ON districts.province_id = provinces.id " +
            "LEFT JOIN post_images " +
            "ON post_images.post_id = posts.id " +
            "LEFT JOIN profiles " +
            "ON profiles.id = posts.account_id " +
            "GROUP BY posts.id " +
            "ORDER BY posts.id DESC";
        const res = await executeQuery(query);
        return res ? res : null;
    } catch (error) {
        logging.error("Read posts service has error: ", error);
        throw error;
    }
};

export default readPostsService;
