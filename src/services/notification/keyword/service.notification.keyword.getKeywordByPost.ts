import { executeQuery } from "../../../configs/database/database";
import logging from "../../../utils/logging";

const readKeywordByPostDetailService = async (
    postTitle: string,
    wardId: string,
    categoryId: number[],
) => {
    try {
        // read keyword by post title
        // if title contains keyword, then return keyword
        const query = `
            SELECT keywords_notification.*
            FROM keywords_notification
            LEFT JOIN child_categories
            ON child_categories.id IN (${categoryId.map(() => '?').join(', ')})
            LEFT JOIN wards
            ON wards.id = ?
            LEFT JOIN type_notification_platform
            ON type_notification_platform.account_id = keywords_notification.account_id
            WHERE ? LIKE CONCAT('%', keywords_notification.keyword, '%') 
            AND keywords_notification.status = 1
            AND type_notification_platform.type = 0
            AND (keywords_notification.district_status = 0 OR keywords_notification.district_id = wards.district_id)
            AND (keywords_notification.category_status = 0 OR keywords_notification.category_id = child_categories.parent_category_id)
            GROUP BY keywords_notification.account_id
            `;

        const values = [
            ...categoryId,
            wardId,
            postTitle,
        ];
        // console.log(query, " query");
        // console.log(values, " values");
    
        const res = await executeQuery(query, values);


        return res;

    } catch (error) {
        logging.error(error);
        return null;
    }
}

export default readKeywordByPostDetailService;