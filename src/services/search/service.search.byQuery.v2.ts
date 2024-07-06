import { executeQuery } from '../../configs/database/database';
import logging from './../../utils/logging';

const searchByQueryV2Service = async (
    lang: string,
    q: string,
    page: number | null,
    districtIds: string[] | undefined | null,
    categoryIds: number[] | undefined | null,
    salaryMin: number | undefined | null,
    salaryMax: number | undefined | null,
    salaryType: number[] | undefined | null,
    isWorkingWeekend: number | undefined | null,
    isRemotely: number | undefined | null,
    startDate : number | undefined | null,
    endDate : number | undefined | null,
    moneyType: number | undefined | null,
    job_type_id: number[] | undefined | null,
    onlyCompany: number | undefined | null,
    accountId: string | undefined | null,
    salary_sort: string | undefined | null,
    expried_sort: string | undefined | null,
    sort_by: string | undefined | null,
) => {
    try {
        logging.info("Search by query v2 service called: ");

        let listIds = await executeQuery(
        `
            SELECT
                posts.id,
                COUNT(*) OVER() AS total
            FROM posts USE INDEX(rev_id_idx)
            INNER JOIN wards ON wards.id = posts.ward_id ${districtIds
                ? `AND wards.district_id IN (${districtIds})`
                : ''
            }
            INNER JOIN posts_categories ON posts_categories.post_id = posts.id ${categoryIds
                ? `AND posts_categories.category_id IN (${categoryIds})`
                : ''
            }
            WHERE posts.status = 1
                AND (posts.expired_date IS NULL OR posts.expired_date >= NOW())
                AND (posts.end_date IS NULL OR posts.end_date >= UNIX_TIMESTAMP(CURRENT_TIMESTAMP()) * 1000)
                ${onlyCompany !== 0 ? "AND company_name LIKE ? " : "AND (company_name LIKE ? OR title LIKE ?) "}
                ${salaryMin !== null ? " AND posts.salary_min >= ? " : ""}
                ${salaryMax !== null ? "AND posts.salary_max <= ? " : ""}
                ${salaryType && salaryType.length > 0 ? `AND posts.salary_type IN (${salaryType.join(",")}) ` : ''}
                ${moneyType !== null ? "AND posts.money_type = ? " : ""}
                ${isWorkingWeekend !== null ? "AND posts.is_working_weekend = ? " : ""}
                ${isRemotely !== null ? "AND posts.is_remotely = ? " : ""}
                ${startDate !== null ? "AND posts.start_date >= ? " : ""}
                ${endDate !== null ? "AND posts.end_date <= ? " : ""}
                ${job_type_id && job_type_id.length > 0 ? `AND posts.job_type IN (${job_type_id.join(",")}) ` : ''}
            GROUP BY posts.id
            ORDER BY created_at_date DESC, field(company_resource_id,2) desc, posts.id desc
            LIMIT 20 OFFSET ?
            `
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' '),
            []
            .concat(onlyCompany !== 0 ? [`%${q}%`] : [`%${q}%`, `%${q}%`])
            .concat(salaryMin !== null ? [salaryMin] : [])
            .concat(salaryMax !== null ? [salaryMax] : [])
            .concat(moneyType !== null ? [moneyType] : [])
            .concat(isWorkingWeekend !== null ? [isWorkingWeekend] : [])
            .concat(isRemotely !== null ? [isRemotely.toString()] : [])
            .concat(startDate !== null ? [startDate] : [])
            .concat(endDate !== null ? [endDate] : [])
            .concat(page !== null ? [(page) * 20] : [])
        );


        if (listIds.length === 0) {
            return [];
        }

        let ids = listIds.map((item: any) => item.id);

        let query =
            "SELECT " +
            "posts.id," +
            "posts.status," +
            "posts.account_id," +
            "posts.title," +
            "posts.company_name, " +
            "posts.is_date_period," +
            "posts.start_date," +
            "posts.end_date," +
            "posts.start_time, " +
            "posts.end_time," +
            "posts.salary_min," +
            "posts.salary_max," +
            "posts.job_type as job_type_id," +
            `${lang === "vi" ? "job_types.name " : lang === "en" ? "job_types.name_en " : "job_types.name_ko "}` +
            "AS job_type_name, " +
            `${lang === "vi" ? "salary_types.value " : lang === "en" ? "salary_types.value_en " : "salary_types.value_ko "}` +
            "AS salary_type, " +
            "posts.created_at, " +
            "post_images.image AS image, " +
            "posts.address, " +
            "posts.ward_id, " +
            `${lang === "vi" ? "wards.full_name as ward, " : "wards.full_name_en as ward, "}` +
            "wards.name as ward_name," +
            "districts.id as district_id," +
            `${lang === "vi" ? "districts.full_name as district, " : "districts.full_name_en as district, "}` +
            "districts.name as district_name, " +
            `${lang === "vi" ? "provinces.full_name as province, " : "provinces.full_name_en as province, "}` +
            "provinces.name as province_name, " +
            "posts.salary_type as salary_type_id, " +
            "posts.money_type, " +
            `${accountId !== null ? "bookmarks.post_id as bookmark_post_id, " : ""}` +
            "company_resource.icon as company_resource_icon, " +
            `${listIds[0].total} as total ` +
            "FROM posts USE INDEX(rev_id_idx) " +
            "INNER JOIN salary_types " +
            "ON posts.salary_type = salary_types.id " +
            "INNER JOIN wards " +
            "ON posts.ward_id = wards.id " +
            "INNER JOIN districts " +
            "ON wards.district_id = districts.id " +
            "INNER JOIN provinces " +
            "ON districts.province_id = provinces.id " +
            "LEFT JOIN post_images " +
            "ON post_images.post_id = posts.id " +
            `${accountId !== null ? "LEFT JOIN (SELECT post_id FROM bookmarks WHERE account_id = ?) AS bookmarks " +
            "ON bookmarks.post_id = posts.id " : ""}` +
            "INNER JOIN company_resource " +
            "ON company_resource.id = posts.company_resource_id " + 
            "INNER JOIN job_types " +
            "ON posts.job_type = job_types.id " +
            `WHERE posts.id IN (${ids.join(",")}) ` +
            "GROUP BY posts.id " +
            "ORDER BY " +
            `FIELD(posts.id, ${ids.join(",")}) `

        const res = await executeQuery(query, [accountId]);
        
        return res ? res : null;
    } catch (error) {
        logging.error("Search by query service has error: ", error);
        throw error;
    }
};

export default searchByQueryV2Service;
