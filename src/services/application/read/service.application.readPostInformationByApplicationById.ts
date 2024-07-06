import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const readPostInformationByApplicationByIdService = async (applicationId: number) => {
    try {
        logging.info("Read owner of job by application id service start ...");
        const query = "SELECT " +
        "posts.account_id as ownerId, " +
        "posts.title, " +
        "posts.company_name, " +
        "posts.status as postStatus, " + 
        "applications.post_id, "+
        "applications.name, " +
        "applications.status, applications.account_id, applications.liked " +
        "FROM applications LEFT JOIN posts ON applications.post_id = posts.id WHERE applications.id = ?";
        const params = [applicationId];
        const res = await executeQuery(query, params);
        return res ? res[0] : null;
    } catch (error) {
        logging.error(
            "Read owner of job by application id service has error: ",
            error
        );
        return null;
    }
}

export default readPostInformationByApplicationByIdService;