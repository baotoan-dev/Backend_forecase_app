import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const createApplicationExperiencesService = async (
    applicationId: number,
    accountId: string
) => {
    try {
        logging.info("Create application EXPERIENCES service start ...");
        const query =
            `INSERT INTO applications_experiences (application_id, title, company_name, start_date, end_date, extra_information) ` +
            `SELECT ?, profiles_experiences.title, profiles_experiences.company_name, profiles_experiences.start_date, ` +
            `profiles_experiences.end_date, profiles_experiences.extra_information from profiles_experiences WHERE profiles_experiences.account_id = ?`;
        const params = [applicationId, accountId];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error("Create application EXPERIENCES service has error: ", error);
        return null;
    }
};

export default createApplicationExperiencesService;
