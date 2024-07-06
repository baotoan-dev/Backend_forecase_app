import { executeQuery } from "../../configs/database/database";
import logging from "../../utils/logging";

const updateEducationOfProfile = async (
    id: number,
    companyName: string,
    major: string,
    startDate: number,
    endDate: number,
    extraInformation: string | null,
    academicTypeId: number
) => {
    try {
        logging.info("Update education of profie service start ...");

        const query =
            "UPDATE profiles_educations " +
            "SET company_name = ?, major = ?, start_date = ?, end_date = ?, extra_information = ?" +
            `${academicTypeId ? ", academic_type_id = ? " : ""}` +
            "WHERE id = ?";

        const params = [
            companyName,
            major,
            startDate,
            endDate,
            extraInformation,
        ];

        if (academicTypeId) params.push(academicTypeId);
        params.push(id);

        const res = await executeQuery(query, params);
        return res ? res.affectedRows === 1 : false;
    } catch (error) {
        logging.error("Update education of profie service has error: ", error);
        throw error;
    }
};

export default updateEducationOfProfile;
