import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const createApplicationEducationsService = async (applicationId: number, accountId: string) => {
    try {
        logging.info("Create application EDUCATIONS service start ...");
        const query = "INSERT INTO applications_educations (application_id, company_name, major, start_date, end_date, extra_information)" + 
        " SELECT ?, profiles_educations.company_name, profiles_educations.major, profiles_educations.start_date," +
        " profiles_educations.end_date, profiles_educations.extra_information from profiles_educations WHERE profiles_educations.account_id = ?";
        const params = [applicationId, accountId];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Create application EDUCATIONS service has error: ",
            error
        );
        return null;
    }
}

export default createApplicationEducationsService;