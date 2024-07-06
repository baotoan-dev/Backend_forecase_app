import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const deleteApplicationCategoriesService = async (applicationId: number) => {
    try {
        logging.info("Delete application categories service start ...");
        const query = "DELETE FROM applications_categories WHERE application_id = ?";
        const params = [applicationId];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Delete application categories service has error: ",
            error
        );
        return null;
    }
}

export default deleteApplicationCategoriesService;