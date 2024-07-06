import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readAllNotificationsByAccountIdService = async (
  accountId: string,
  page: number,
  limit: number,
  lang: string = "vi"
) => {
  try {
    const query = `
        SELECT t.*,
        COUNT(*) OVER() as total
        FROM (
            SELECT notifications.id,
            notifications.application_id,
            notifications.is_read,
            notifications.type,
            notifications.created_at,
            notifications.application_status,
            applications.name,
            posts.title as post_title,
            posts.company_name,
            posts.id as post_id,
            null as image,
            null as district,
            null as province,
            null as job_type,
            null as company_resource_logo,
            notifications.account_id

            FROM notifications
            LEFT JOIN applications ON applications.id = notifications.application_id
            LEFT JOIN posts ON posts.id = applications.post_id
            WHERE notifications.account_id = ?
            GROUP BY notifications.id

            UNION SELECT
            post_notification.id,
            null as application_id,
            post_notification.is_read,
            3 as type,
            post_notification.created_at,
            null as application_status,
            null as name,
            posts.title as post_title,
            posts.company_name,
            posts.id as post_id,
            post_images.image AS image,
            ${lang === "vi" ? "districts.full_name" :  "districts.full_name_en"} as district,
            ${lang === "vi" ? "provinces.full_name" :  "provinces.full_name_en"} as province,
            ${lang === "vi" ? "job_types.name" : lang === "en" ? "job_types.name_en" : "job_types.name_ko"} as job_type,
            company_resource.icon as company_resource_logo,
            post_notification.account_id
            FROM post_notification
            LEFT JOIN posts ON posts.id = post_notification.post_id
            LEFT JOIN wards
            ON wards.id = posts.ward_id
            LEFT JOIN districts
            ON districts.id = wards.district_id
            LEFT JOIN provinces
            ON provinces.id = districts.province_id
            LEFT JOIN post_images
            ON post_images.post_id = posts.id
            LEFT JOIN job_types
            ON job_types.id = posts.job_type
            LEFT JOIN post_resource
            ON post_resource.post_id = posts.id
            LEFT JOIN company_resource
            ON company_resource.id = post_resource.company
            WHERE post_notification.account_id = ?
            GROUP BY post_notification.id

            UNION SELECT
            communication_notifications.id,
            communication_notifications.comment_id as application_id,
            communication_notifications.status as is_read,
            4 as type,
            communication_notifications.created_at,
            null as application_status,
            null as name,
            null as post_title,
            null as company_name,
            communication_notifications.communication_id as post_id,
            null as image,
            null as district,
            null as province,
            null as job_type,
            null as company_resource_logo,
            communications.account_id
            FROM communication_notifications
            INNER JOIN communications ON communications.id = communication_notifications.communication_id
            WHERE communications.account_id = ?
        ) as t
        ORDER BY created_at DESC
        LIMIT ? OFFSET ${page * limit}
    `;
    // LIMIT ${limit}
    // OFFSET ${page * limit}
    // ${page ? ` LIMIT ? OFFSET ${page * 10}` : 'LIMIT ?'}

    // console.log(query);
    const params = [accountId, accountId, accountId, limit];
    const result = await executeQuery(query, params);
    return result;
  } catch (error) {
    logging.error(error);
    return null;
  }
};

export default readAllNotificationsByAccountIdService;
