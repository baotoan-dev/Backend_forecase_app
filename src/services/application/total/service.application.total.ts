import logging from '../../../utils/logging';
import {executeQuery} from '../../../configs/database/database';

const totalApplicationService = async (accountId: string, type: string) => {
  try {
    logging.info('Get total application service start ...');
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
          COALESCE(DATE_FORMAT(posts.created_at, "%Y"), YEAR(NOW())) AS year,
          COUNT(posts.account_id) AS total
      FROM 
          all_months m
      LEFT JOIN 
          applications 
          INNER JOIN posts ON posts.id = applications.post_id 
      ON 
          m.month = MONTH(posts.created_at)
      AND 
          posts.account_id = ? 
          ${
            type && (type === 'apply' || type === 'acp' || type === 'nac')
                ? `AND applications.status = ${
                    type === 'acp' ? 4 : type === 'nac' ? 5 : 0
                }`
                : ''
          }
      GROUP BY 
          year, m.month
      ORDER BY 
          year, m.month;
  `;

    const params = [accountId];

    const res = await executeQuery(query, params);

    // Check if there are any results
    if (res && res.length > 0) {
      let count = 0;
      // Process the results as needed
      const monthlyStats = res.map((row) => ({
        month: parseInt(row.month),
        yeard: parseInt(row.year),
        count: parseInt(row.total),
      }));

      count = monthlyStats.reduce((a, b) => a + b.count, 0);

      return {
        activities: monthlyStats,
        total: count,
      };
    } else {
      // Handle the case where no results are found
      logging.warning(
        'No applications found for the provided accountId:',
        accountId,
      );
      return [];
    }
  } catch (error) {
    logging.error('Get total application service has error: ', error);
    return null;
  }
};

export default totalApplicationService;
