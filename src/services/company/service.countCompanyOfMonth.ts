import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging"

const serviceCountCompanyOfMonth = async (year: number) => {
    try {
        logging.info('Count company start.....')

        const query = `SELECT 
                   months.name,
                   IFNULL(companies.company, 0) as company
               FROM (
                   SELECT 'Jan' as name, 1 as month_number UNION ALL
                   SELECT 'Feb' as name, 2 as month_number UNION ALL
                   SELECT 'Mar' as name, 3 as month_number UNION ALL
                   SELECT 'Apr' as name, 4 as month_number UNION ALL
                   SELECT 'May' as name, 5 as month_number UNION ALL
                   SELECT 'Jun' as name, 6 as month_number UNION ALL
                   SELECT 'Jul' as name, 7 as month_number UNION ALL
                   SELECT 'Aug' as name, 8 as month_number UNION ALL
                   SELECT 'Sep' as name, 9 as month_number UNION ALL
                   SELECT 'Oct' as name, 10 as month_number UNION ALL
                   SELECT 'Nov' as name, 11 as month_number UNION ALL
                   SELECT 'Dec' as name, 12 as month_number
               ) as months
               LEFT JOIN (
                   SELECT 
                       CASE 
                           WHEN MONTH(created_at) = 1 THEN 'Jan'
                           WHEN MONTH(created_at) = 2 THEN 'Feb'
                           WHEN MONTH(created_at) = 3 THEN 'Mar'
                           WHEN MONTH(created_at) = 4 THEN 'Apr'
                           WHEN MONTH(created_at) = 5 THEN 'May'
                           WHEN MONTH(created_at) = 6 THEN 'Jun'
                           WHEN MONTH(created_at) = 7 THEN 'Jul'
                           WHEN MONTH(created_at) = 8 THEN 'Aug'
                           WHEN MONTH(created_at) = 9 THEN 'Sep'
                           WHEN MONTH(created_at) = 10 THEN 'Oct'
                           WHEN MONTH(created_at) = 11 THEN 'Nov'
                           WHEN MONTH(created_at) = 12 THEN 'Dec'
                       END as name,
                       COUNT(*) as company
                   FROM companies 
                   WHERE YEAR(created_at) = ${year}
                   GROUP BY MONTH(created_at)
               ) as companies
               ON months.name = companies.name
               ORDER BY months.month_number`;

        logging.info('Count company end.....')
        const res = await executeQuery(query);
        res.map((item: any) => {
            item.company = Number(item.company)
        })
        return res ? res : null;

    } catch (error) {
        logging.error('Error from count company')
        throw error;
    }
}

export default serviceCountCompanyOfMonth;