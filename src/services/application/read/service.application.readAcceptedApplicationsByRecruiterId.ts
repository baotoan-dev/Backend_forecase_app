import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const readAcceptedApplicationsByRecruiterIdService = async (recruiterId: string, limit: number | null, threshold: number | null) => {
    try {
        logging.info('Read accepted applications by recruiter id service start ...');
        const query = 
        "SELECT applications.id, " +
        "applications.status, " +
        "applications.name, " +
        "applications.account_id, "+ 
        "applications.birthday, " + 
        "applications.address, " + 
        "applications.gender, " + 
        "applications.created_at, " +
        "provinces.name as province, " +
        "applications.avatar, " +
        "posts.id as post_id " + 
        "FROM applications " +
        "LEFT JOIN provinces ON applications.address = provinces.id " +
        "LEFT JOIN posts ON applications.post_id = posts.id " +
        "WHERE posts.account_id = ? " +
        "AND applications.status = 4 " +
        `${threshold ? " AND applications.id < ?" : ""} ` +
        "ORDER BY applications.id DESC " +
        `${limit ? " LIMIT ?" : ""} `;
        const params = threshold ? [recruiterId, threshold, limit] : [recruiterId, limit];
        const res = await executeQuery(query, params);
        // console.log(res)
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read applications of post id service has error: ",
            error
        );
        throw error;
    }
}

export default readAcceptedApplicationsByRecruiterIdService;