import {executeQuery} from '../../../configs/database/database';
import logging from '../../../utils/logging';

const readCandidateBookmark = async (recruit_id: string) => {
  try {
    const query = `
        WITH all_months AS (
            SELECT 1 AS month
            UNION SELECT 2
            UNION SELECT 3
            UNION SELECT 4
            UNION SELECT 5
            UNION SELECT 6
            UNION SELECT 7
            UNION SELECT 8
            UNION SELECT 9
            UNION SELECT 10
            UNION SELECT 11
            UNION SELECT 12
        )
    
        SELECT 
            m.month, 
            COALESCE(DATE_FORMAT(cb.created_at, "%Y"), YEAR(NOW())) AS year,
            COUNT(cb.candidate_id) AS total
        FROM 
            all_months m
        LEFT JOIN 
            candidate_bookmarked cb ON m.month = MONTH(cb.created_at) AND recruit_id = ?
        GROUP BY 
            year, m.month
        ORDER BY 
            year, m.month;
    `;

    const params = [recruit_id];

    const res = await executeQuery(query, params);

    if (res && res.length > 0) {
      let count = 0;

      const monthlyStats = res.map((row) => ({
        month: parseInt(row.month),
        year:  parseInt(row.year),
        count: parseInt(row.total),
      }));

      count = monthlyStats.reduce((a, b) => a + b.count, 0);

      return {
        activities: monthlyStats,
        total: count,
      };
    }
  } catch (error) {
    logging.error(error);
    return null;
  }
};

export default readCandidateBookmark;
