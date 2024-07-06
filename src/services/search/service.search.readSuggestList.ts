import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const readSuggestedListSearchService = async (limit: number) => {
    try {
        // Read history search
        // read suggest list search
        // from table search_history
        // group by keyword
        // order by sum of count keyword
        const query = `
        SELECT keyword, 1 as count
        FROM suggest_search
        WHERE status = 1
        GROUP BY keyword
        ORDER BY \`order\`
        LIMIT ?
        `;

        const params = [limit];

        const result: any = await executeQuery(
            query,
            params,
        );
        return result.map((dt:any)=>{
            dt.count = parseInt(dt.count)
            return dt
        })
    } catch (error) {
        logging.error(error);
        return null;
    }
}

export default readSuggestedListSearchService;