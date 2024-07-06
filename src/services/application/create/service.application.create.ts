import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const createApplicationService = async (accountId: String, postId: number, cvURL?:string) => {
    try {
        logging.info("Create application service start ...");
        // console.log(accountId);
        const query = 
            // cvURL ? (" INSERT INTO applications (account_id, post_id, name, birthday, address," +
            // " gender, introduction, phone, email, facebook, linkedin, avatar, cv_url)" +
            // " SELECT ?, ?, profiles.name, profiles.birthday, profiles.address," +
            // " profiles.gender, profiles.introduction, profiles.phone, profiles.email, profiles.facebook," +
            // " profiles.linkedin, profiles.avatar, cv_url FROM profiles WHERE profiles.id = ?")
            
            // :
            
            (" INSERT INTO applications (account_id, post_id, name, birthday, address," +
            " gender, introduction, phone, email, facebook, linkedin, avatar)" +
            " SELECT ?, ?, profiles.name, profiles.birthday, profiles.address," +
            " profiles.gender, profiles.introduction, profiles.phone, profiles.email, profiles.facebook," +
            " profiles.linkedin, profiles.avatar FROM profiles WHERE profiles.id = ?")

        const updateQuery = "UPDATE applications SET cv_url = ? WHERE account_id = ? AND post_id = ?";

        // const params = !cvURL ? [accountId, postId, accountId] : [accountId, postId, accountId, cvURL, accountId, postId];

        const params = [accountId, postId, accountId];

        const updateParams = [cvURL, accountId, postId];

        const res = await executeQuery(query, params);

        if (cvURL) {
            await executeQuery(updateQuery, updateParams);
        }

        // console.log(res);
        return res ? res : null;
    } catch (error) {
        console.log(error);
        logging.error(
            "Create application service has error: ",
            error
        );
        return null;
    }
};

export default createApplicationService;
