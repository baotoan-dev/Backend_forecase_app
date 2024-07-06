import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readAcceptedPostsInBookmark = async (
    lang: string = "vi",
    accountId: string,
    limit: number | null,
    page: number | null
) => {
    try {
        logging.info("Read accepted posts in bookmark service start ...");

        // Tính offset
        const offset = limit && page ? (page) * limit : 0;

        const query =
            "SELECT bookmarks.id as bookmark_id, " +
            "posts.id," +
            "posts.status," +
            "posts.account_id," +
            "posts.title," +
            "posts.company_name," +
            "posts.address," +
            "posts.ward_id," +
            "posts.is_date_period," +
            "posts.is_working_weekend," +
            "posts.start_date," +
            "posts.end_date," +
            "posts.start_time," +
            "posts.end_time," +
            "posts.salary_min," +
            "posts.salary_max," +
            "posts.salary_type as salary_type_id," +
            "posts.money_type," +
            "posts.created_at," +
            `${lang === "vi" ? "wards.full_name" : "wards.full_name_en"}` + " as ward," +
            "wards.name as ward_name," +
            "districts.id as district_id," +
            `${lang === "vi" ? "districts.full_name" : "districts.full_name_en"}` + " as district," + 
            "districts.name as district_name," +
            `${lang === "vi" ? "provinces.full_name" : "provinces.full_name_en" }` + " as province," +
            "provinces.name as province_name," +
            "provinces.id as province_id," +
            `${lang === "vi" ? "salary_types.value" 
                : lang === "en" ? "salary_types.value_en" : "salary_types.value_ko"}` +
            " as salary_type," +
            "company_resource.icon as company_resource_icon, " +
            "post_images.image AS image, " +
            "posts.job_type, " +
            `${lang === "vi" ? "job_types.name " : lang === "en" ? "job_types.name_en " : "job_types.name_ko "}` +
            "AS job_type_name " +
            "FROM bookmarks " +
            "LEFT JOIN posts " +
            "ON posts.id = bookmarks.post_id " +
            "LEFT JOIN posts_categories " +
            "ON posts_categories.post_id = posts.id " +
            "LEFT JOIN salary_types " +
            "ON posts.salary_type = salary_types.id " +
            "LEFT JOIN wards " + 
            "ON posts.ward_id = wards.id " + 
            "LEFT JOIN districts " +
            "ON districts.id = wards.district_id " +
            "LEFT JOIN provinces " +
            "ON districts.province_id = provinces.id " +
            "LEFT JOIN post_images " + 
            "ON post_images.post_id = posts.id " +
            "LEFT JOIN post_resource " +
            "ON post_resource.post_id = posts.id " +
            "LEFT JOIN company_resource " +
            "ON company_resource.id = post_resource.company " +
            "LEFT JOIN job_types " +
            "ON job_types.id = posts.job_type " +
            "WHERE posts.status = 1 " +
            "AND bookmarks.account_id = ? " +
            "GROUP BY bookmarks.id ORDER BY bookmarks.id DESC " +
            "LIMIT ? OFFSET ?"; 

        const params = [accountId, limit, offset];

        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read accepted posts in bookmark service has error: ",
            error
        );
        return false;
    }
};

export default readAcceptedPostsInBookmark;
