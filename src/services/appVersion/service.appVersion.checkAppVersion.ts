import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const checkAppVersionValidService = async (
    appVersion: string,
    platform: string
) => {
    try {
        // Check app version
        const query = `
            SELECT * FROM app_version
            WHERE version = ? 
            AND platform = ?
        `;

        const params = [appVersion, platform];

        const result: any = await executeQuery(query, params);

        // false is not force update
        // true is force update
        // If not found
        // return false
        // If found
        // return true if is_force_update === 1
        // return false if is_force_update === 0
        return result.length === 0 ? false : result[0].is_force_update === 1 ? true : false;
    } catch (error) {
        logging.error(error);
        return null;
    }
};

export default checkAppVersionValidService;
