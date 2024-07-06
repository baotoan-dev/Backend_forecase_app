import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const createApplicationCategoriesService = async (applicationId: number, accountId: string) => {
    try {
        logging.info("Create application category service start ...");
        const query = "INSERT INTO applications_categories (application_id, category_id)" + 
        " SELECT ?, category_id FROM profiles_categories WHERE account_id = ?";
        const params = [applicationId, accountId];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Create application category service has error: ",
            error
        );
        return null;
    }
}

export default createApplicationCategoriesService;