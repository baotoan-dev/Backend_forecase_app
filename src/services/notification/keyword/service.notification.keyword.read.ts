import { executeQuery } from "../../../configs/database/database";
import logging from "../../../utils/logging";

const readKeywordNotificationByAccountIdService = async (
    accountId: string,
    lang: string = "vi"
) => {
    try {

        const query = `
            SELECT 
            keywords_notification.id,
            keywords_notification.keyword,
            keywords_notification.account_id,
            keywords_notification.district_id,
            keywords_notification.category_id,
            keywords_notification.district_status,
            keywords_notification.category_status,
            keywords_notification.status,
            keywords_notification.created_at,
            ${lang === "vi" ? "districts.full_name" :  "districts.full_name_en"} as district_name, 
            ${lang === "vi" ? "provinces.full_name" :  "provinces.full_name_en"} as province_name,
            ${lang === "vi" ? "parent_categories.name" : lang === "en" ? "parent_categories.name_en" : "parent_categories.name_kor"} as category_name
            FROM keywords_notification
            LEFT JOIN districts
            ON districts.id = keywords_notification.district_id
            LEFT JOIN provinces
            ON provinces.id = districts.province_id
            LEFT JOIN parent_categories
            ON parent_categories.id = keywords_notification.category_id
            WHERE account_id = ?
            GROUP BY keywords_notification.id
            ORDER BY keywords_notification.created_at DESC
        `;

        const values = [
            accountId,
        ];
    
        const res = await executeQuery(query, values);

        return res;

    } catch (error) {
        logging.error(error);
        return null;
    }
}

export default readKeywordNotificationByAccountIdService;