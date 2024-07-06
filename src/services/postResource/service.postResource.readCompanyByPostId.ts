import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const readCompanyInformationByPostId = async (
    post_id: number
) => {
    try {
        const query = "SELECT company_resource.icon " +
        "FROM post_resource " +
        "LEFT JOIN company_resource " +
        "ON post_resource.company = company_resource.id " +
        "WHERE post_id = ?";
        const params = [post_id];
        const res = await executeQuery(query, params);
        return res[0];
    } catch (error) {
        throw error;
    }
};

export default readCompanyInformationByPostId;
