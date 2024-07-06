import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const resultSearchJobService = async (accountId: string = null) => {
  try {
    // get data from 12 th in current year
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

        SELECT m.month, COALESCE(YEAR(v.updated_at), YEAR(NOW())) AS year, COUNT(v.account_id) AS total
        FROM all_months m
        LEFT JOIN search_history v ON m.month = MONTH(v.updated_at) AND account_id = ? AND YEAR(v.updated_at) = YEAR(NOW())
        GROUP BY m.month, year
        ORDER BY year, m.month;
`;

    const params = [accountId];

    const res = await executeQuery(query, params);

    if (res && res.length > 0) {
      let count = 0;

      const monthlyStats = res.map((row) => ({
        month: parseInt(row.month),
        year: parseInt(row.year),
        count: parseInt(row.total),
      }));

      count = monthlyStats.reduce((a, b) => a + b.count, 0);

      return {
        activities: monthlyStats,
        total: count,
      };
    } else {
      logging.warning(
        'No candidates found for the provided recruitId:',
        accountId,
      );
      return [];
    }
  } catch (error) {
    logging.error(error);
    return null;
  }
};

export default resultSearchJobService;
