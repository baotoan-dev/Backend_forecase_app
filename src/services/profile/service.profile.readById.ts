import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const readProfileByIdService = async (
    lang: string,
    profileId: string
) => {
    try {
        logging.info("Read profile by id service start ...");
        // const query =
        //     "SELECT profiles.id, profiles.name, profiles.birthday, provinces.name as address, profiles.gender, profiles.introduction, profiles.phone, profiles.email, profiles.avatar " +
        //     "FROM profiles, provinces WHERE profiles.id = ? AND profiles.address = provinces.id";
        const query =
            "SELECT profiles.id, " +
            "profiles.name, " +
            "accounts.status," +
            "profiles.birthday, " +
            "provinces.id as province_id, " +
            `${lang === "vi" ? "provinces.full_name" : "provinces.full_name_en"} as address, ` +
            "profiles.gender, " +
            "profiles.introduction, " +
            "profiles.phone, " +
            "profiles.email, " +
            "profiles.avatar, " +
            "profiles.facebook, " +
            "profiles.linkedin, " +
            "profiles.cv_url " +
            "FROM profiles " +
            "LEFT JOIN provinces " +
            "ON provinces.id = profiles.address " +
            "LEFT JOIN accounts " +
            "ON profiles.id = accounts.id " +
            "WHERE profiles.id = ?";
        const params = [profileId];
        const res = await executeQuery(query, params);
        return res ? res[0] : null;
    } catch (error) {
        logging.error("Read profile by id service has error: ", error);
        throw error;
    }
};

export default readProfileByIdService;
