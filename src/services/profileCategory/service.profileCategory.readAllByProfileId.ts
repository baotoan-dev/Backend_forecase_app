import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readAllByProfileId = async (
    lang: string,
    profileId: string
) => {
  try {
    logging.info("Read all categories by profile id service start ...");
    const query =
        "SELECT profiles_categories.category_id as child_category_id, " +
        "child_categories.parent_category_id as parent_category_id, " +
        `${lang === "vi" ? "parent_categories.name" 
            : lang === "en" ? "parent_categories.name_en" 
            : "parent_categories.name_kor"} as parent_category,` +
        `${lang === "vi" ? "child_categories.name" 
            : lang === "en" ? "child_categories.name_en" 
            : "child_categories.name_kor"} as child_category ` +
        "FROM profiles_categories " +
        "JOIN child_categories ON profiles_categories.category_id = child_categories.id " + 
        "JOIN parent_categories ON child_categories.parent_category_id = parent_categories.id " + 
        "WHERE profiles_categories.account_id = ?";
    const params = [profileId];
    return executeQuery(query, params);
  } catch (error) {
    logging.error(
      `Read all categories by profile id servive has error: ${error}`
    );
    throw error;
  }
};

export default readAllByProfileId;
