import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { expiredDateCondition, initQueryReadPost } from "./_service.post.initQuery";
import { query } from "express";

const readNewestAcceptedPostsByDistricts = async (
    lang: string = "vi",
    districtIds: string[],
    limit: number | null,
    threshold: number | null
) => {
    try {
        logging.info(
            "Read newest accepted posts by districts service start ..."
        );

        let query =
            initQueryReadPost(lang) +
            "WHERE posts.status = ? AND posts.salary_type = salary_types.id " +
            expiredDateCondition() +
            `AND districts.id IN (${districtIds.map((_) => `?`).join(", ")}) ` +
            `${threshold && threshold > 0 ? "AND posts.id < ? " : " "}` +
            "GROUP BY posts.id ORDER BY posts.id DESC " +
            `${limit && limit > 0 ? "LIMIT ?" : ""}`;

        let params = [1, ...districtIds]
            .concat(threshold && threshold > 0 ? [threshold] : [])
            .concat(limit && limit > 0 ? [limit] : []);

        const res = await executeQuery(query, params);
        return res ? res : null;
    } catch (error) {
        logging.error(
            "Read newest accepted posts by parent category and districts service has error: ",
            error
        );
        // console.log(query);
        throw error;
    }
};

export default readNewestAcceptedPostsByDistricts;