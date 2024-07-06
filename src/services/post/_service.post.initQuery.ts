

const initQueryReadPost = (lang: string): string => {
    return `
    SELECT
        posts.id,
        posts.account_id,
        posts.title,
        posts.company_name,
        posts.ward_id,
        posts.start_date,
        posts.end_date,
        posts.start_time,
        posts.end_time,
        posts.salary_min,
        posts.salary_max,
        posts.salary_type as salary_type_id,
        posts.money_type,
        posts.description,
        posts.created_at,
        posts.status,
        posts.is_inhouse_data,
        posts.job_type,
        ${lang === "vi" ? "job_types.name" : lang === "en" ? "job_types.name_en" : "job_types.name_ko"} as job_type_name,
        ${lang === "vi" ? "wards.full_name" : "wards.full_name_en"} as ward,
        wards.name as ward_name,
        districts.id as district_id,
        ${lang === "vi" ? "districts.full_name" : "districts.full_name_en"} as district,
        districts.name as district_name,
        ${lang === "vi" ? "provinces.full_name" : "provinces.full_name_en"} as province,
        provinces.name as province_name,
        provinces.id as province_id,
        ${lang === "vi" ? "salary_types.value" : lang === "en" ? "salary_types.value_en" : "salary_types.value_ko"} as salary_type,
        post_images.image AS image,
        posts.expired_date,
        company_resource.icon as company_resource_icon
        FROM posts
    LEFT JOIN wards
    ON wards.id = posts.ward_id
    LEFT JOIN districts
    ON districts.id = wards.district_id
    LEFT JOIN provinces
    ON provinces.id = districts.province_id
    LEFT JOIN salary_types
    ON salary_types.id = posts.salary_type
    LEFT JOIN post_images
    ON post_images.post_id = posts.id
    LEFT JOIN post_resource
    ON post_resource.post_id = posts.id
    LEFT JOIN company_resource
    ON company_resource.id = post_resource.company 
    LEFT JOIN job_types
    ON job_types.id = posts.job_type
    `;
    // AND company_resource.id IN (7,8,2)
}

const initQueryCountPost = (): string => {
    return `
    SELECT COUNT(*) AS totalCount
    FROM posts
    LEFT JOIN wards ON wards.id = posts.ward_id
    LEFT JOIN districts ON districts.id = wards.district_id
    LEFT JOIN provinces ON provinces.id = districts.province_id
    LEFT JOIN salary_types ON salary_types.id = posts.salary_type
    LEFT JOIN post_images ON post_images.post_id = posts.id
    LEFT JOIN post_resource ON post_resource.post_id = posts.id
    LEFT JOIN company_resource ON company_resource.id = post_resource.company 
    LEFT JOIN job_types ON job_types.id = posts.job_type
    `;
}
// /        post_resource.url as url,
// post_resource.company as company_resource,
// company_resource.name as company_resource_name,
const initQueryReadDetailPost = (lang: string): string => {
    return `
    SELECT
    posts.id,
    posts.status,
    posts.account_id,
    posts.title,
    posts.company_name,
    posts.address,
    posts.latitude,
    posts.longitude,
    posts.ward_id,
    posts.is_date_period,
    posts.is_working_weekend,
    posts.is_remotely,
    posts.start_date,
    posts.end_date,
    posts.start_time,
    posts.end_time,
    posts.salary_min,
    posts.salary_max,
    posts.salary_type as salary_type_id,
    posts.money_type,
    posts.description,
    posts.phone_contact,
    posts.email,
    posts.is_inhouse_data,
    posts.created_at,
    posts.expired_date,
    posts.job_type,
    company_sizes.name as company_size,
    ${lang === "vi" ? "job_types.name" : lang === "en" ? "job_types.name_en" : "job_types.name_ko"} as job_type_name,
    ${lang === "vi" ? "wards.full_name" : "wards.full_name_en"} as ward,
    wards.name as ward_name,
    districts.id as district_id,
    ${lang === "vi" ? "districts.full_name" : "districts.full_name_en"} as district, 
    districts.name as district_name,
    ${lang === "vi" ? "provinces.full_name" : "provinces.full_name_en"} as province,
    provinces.name as province_name,
    provinces.id as province_id,
    ${lang === "vi" ? "salary_types.value" : lang === "en" ? "salary_types.value_en" : "salary_types.value_ko"} as salary_type,
    post_images.image AS image, 
    profiles.avatar as avatar_poster,
    post_resource.url as url,
    post_resource.company as company_resource,
    company_resource.name as company_resource_name,
    company_resource.icon as company_resource_icon
    FROM posts 
    LEFT JOIN wards 
    ON wards.id = posts.ward_id 
    LEFT JOIN districts 
    ON districts.id = wards.district_id 
    LEFT JOIN provinces 
    ON provinces.id = districts.province_id 
    LEFT JOIN post_images 
    ON post_images.post_id = posts.id 
    LEFT JOIN salary_types 
    ON salary_types.id = posts.salary_type 
    LEFT JOIN profiles 
    ON profiles.id = posts.account_id 
    LEFT JOIN post_resource
    ON post_resource.post_id = posts.id
    LEFT JOIN company_resource
    ON company_resource.id = post_resource.company
    LEFT JOIN job_types
    ON job_types.id = posts.job_type
    `;

}

const expiredDateCondition = () => {
    // some post don't have expired date
    return `
     AND (posts.expired_date IS NULL OR posts.expired_date >= NOW()) 
    `;
}

const sortByCompanyResource = (companyResource: number[] = [2]) => {
    return `CASE WHEN post_resource.company IN (${companyResource.join(',')}) THEN 0 ELSE 1 END ASC`;
}

/**
 * 
 * @returns 
 * 
 * @description
 * sort by format date dd/mm/yyyy
 * 
 */
const sortByDate = () => {
    return `posts.id DESC`;
}

const sort = (condition: string[]) => {
    return `
    ORDER BY ${condition.join(",")}
    `;
}

export { initQueryReadPost, initQueryReadDetailPost, expiredDateCondition, sortByCompanyResource, sortByDate, sort, initQueryCountPost };