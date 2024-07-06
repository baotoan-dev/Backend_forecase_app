import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const readPostsAndApplicationsBYAccountIdService = async (
    lang: string | null = "vi",
    accountId: String, 
    page: number = 0
) => {
    // only created 1 month ago
    try {
        logging.info('Read posts and applications applications by recruiter id service start ...');
        const query = 
        `SELECT t.*, 
        ${lang === "vi" ? "wards.full_name"  : "wards.full_name_en"} as ward,     
        wards.name as ward_name, 
        districts.id as district_id, 
        ${lang === "vi" ? "districts.full_name"  : "districts.full_name_en"} as district, 
        districts.name as district_name, 
        ${lang === "vi" ? "provinces.full_name"  : "provinces.full_name_en"} as province, 
        provinces.name as province_name, 
        provinces.id as province_id, 
        post_images.image as image, 
        ${lang === "vi" ? "salary_types.value"  
        : lang === "en" ? "salary_types.value_en" : "salary_types.value_ko" } as salary_type,
        ${lang === "vi" ? "job_types.name" : lang === "en" ? "job_types.name_en" : "job_types.name_ko"} as job_type_name
        FROM ( 
        SELECT 
        applications.id, 
        applications.post_id, 
        posts.account_id, 
        posts.title, 
        posts.company_name,    
        posts.address, 
        posts.ward_id, 
        applications.status, 
        'application' as type, 
        applications.created_at, 
        NULL as num_of_application, 
        posts.start_date, 
        posts.end_date, 
        posts.salary_min, 
        posts.salary_max, 
        posts.salary_type as salary_type_id,
        posts.money_type, 
        posts.status as post_status,
        applications.updated_at,
        posts.is_inhouse_data,
        posts.job_type,
        posts.expired_date
        FROM applications 
        LEFT JOIN posts ON applications.post_id = posts.id 
        WHERE applications.account_id = ? 
        UNION SELECT 
        posts.id, 
        posts.id as post_id, 
        posts.account_id, 
        posts.title, 
        posts.company_name, 
        posts.address, 
        posts.ward_id, 
        posts.status, 
        'post' as type, 
        posts.created_at, 
        COUNT(applications.id) as num_of_application, 
        posts.start_date, 
        posts.end_date, 
        posts.salary_min, 
        posts.salary_max, 
        posts.salary_type as salary_type_id,
        posts.money_type, 
        posts.status as post_status,
        COALESCE((SELECT MAX(updated_at) FROM applications WHERE post_id = posts.id), posts.created_at) as updated_at,
        posts.is_inhouse_data,
        posts.job_type,
        posts.expired_date
        FROM posts 
        LEFT JOIN applications ON applications.post_id = posts.id 
        WHERE posts.account_id = ? 
        GROUP BY posts.id 
        ) as t 
        LEFT JOIN wards ON wards.id = t.ward_id 
        LEFT JOIN salary_types ON salary_types.id = t.salary_type_id 
        LEFT JOIN districts ON districts.id = wards.district_id 
        LEFT JOIN provinces ON provinces.id = districts.province_id 
        LEFT JOIN (SELECT DISTINCT post_id, image FROM post_images GROUP BY post_id) 
        as post_images ON post_images.post_id = t.post_id 
        LEFT JOIN job_types ON job_types.id = t.job_type
        WHERE t.post_status = 1
        AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
        ORDER BY updated_at DESC 
        LIMIT ? OFFSET ?
        `;

        
        const params = [accountId, accountId, 10, page * 10];
        const res = await executeQuery(query, params);

        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read applications of post id service has error: ",
            error
        );
        throw error;
    }
}

export default readPostsAndApplicationsBYAccountIdService;
