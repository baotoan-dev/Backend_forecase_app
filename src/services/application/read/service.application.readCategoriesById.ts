import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const readApplicationCategoriesByIdService = async (lang: string = "vi", applicationId: number) => {
    try {
        logging.info("Read application categories service start ...");
        // read application_id from applications_categories table
        // read category_id from applications_categories table
        // get name, category_id, parent_category_id from child_categories table
        // read name, parent_category_id from parent_categories table
        // get name, id from parent_categories table
        const query = "SELECT applications_categories.category_id as child_category_id, " +
        "child_categories.parent_category_id as parent_category_id, " +
        `${lang === "vi" ? "parent_categories.name" 
            : lang === "en" ? "parent_categories.name_en" 
            : "parent_categories.name_kor"} as parent_category,` +
        `${lang === "vi" ? "child_categories.name" 
            : lang === "en" ? "child_categories.name_en" 
            : "child_categories.name_kor"} as child_category ` +
        "FROM applications_categories " +
        "JOIN child_categories ON applications_categories.category_id = child_categories.id " + 
        "JOIN parent_categories ON child_categories.parent_category_id = parent_categories.id " + 
        "WHERE applications_categories.application_id = ?";
        const params = [applicationId];
        const res = await executeQuery(query, params);
        // console.log(res);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read application categories service has error: ",
            error
        );
        return null;
    }
}

export default readApplicationCategoriesByIdService;