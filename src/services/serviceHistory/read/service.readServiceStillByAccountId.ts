import { executeQuery } from "../../../configs/database/database";
import logging from "../../../utils/logging";

const readServiceStillByAccountIdService = async (accountId: string) => {
    try {
        logging.info("Read service still by account id service start ...");

        const query = `
            SELECT DISTINCT service_type
            FROM service_history
            WHERE account_id = ?
            AND DATE_ADD(created_at, INTERVAL service_expiration DAY) > NOW()
            GROUP BY service_type
        `;

        const params = [accountId]; 

        const res = await executeQuery(query, params);

        const serviceTypes = res.map((row: any) => row.service_type);

        return serviceTypes;
    } catch (error) {
        logging.error("Read service still by account id service has error: ", error);
        throw error; 
    }
};


export default readServiceStillByAccountIdService;
