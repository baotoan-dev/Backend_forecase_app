import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readChildCategoriesByParentCategoryId = async (
    parentCategoryId: number,
    lang: string
) => {
    try {
        // logging.info(
        //     "Read child categories by parent category id service start ..."
        // );
        const query =
            "SELECT id, " +
            `${lang === "vi" ? "name " : lang === "en" ? "name_en as name " : "name_kor as name "}` + 
            "FROM child_categories WHERE parent_category_id = ? AND status = 1";
        const params = [parentCategoryId];
        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read child categories by parent category id has error: ",
            error
        );
        throw error;
    }
};

export default readChildCategoriesByParentCategoryId;
