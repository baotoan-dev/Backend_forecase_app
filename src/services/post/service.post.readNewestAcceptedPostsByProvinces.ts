import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { expiredDateCondition, initQueryCountPost, initQueryReadPost } from "./_service.post.initQuery";

const readNewestAcceptedPostsByProvinces = async (
    lang: string,
    accountId: string,
    provinceIds: string[],
    limit: number | null,
    page: number | null
) => {
    try {
        logging.info(
            "Read newest accepted posts by provinces service start ..."
        );

        let query =
            initQueryReadPost(lang) +
            "WHERE posts.status = ? " +
            "AND provinces.id IN (" +
            provinceIds.map(() => "?").join(", ") +
            ") " +
            "AND district_id NOT IN (SELECT location_id FROM profiles_locations WHERE account_id = ?) ";

        const params = [1, ...provinceIds, accountId];

        // Count total records for pagination
        const countQuery = initQueryCountPost() +
            "WHERE posts.status = ? " +
            "AND provinces.id IN (" +
            provinceIds.map(() => "?").join(", ") +
            ") " +
            "AND district_id NOT IN (SELECT location_id FROM profiles_locations WHERE account_id = ?) ";
        const countParams = [1, ...provinceIds, accountId];

        let total = await executeQuery(countQuery, countParams);

        total = total[0].totalCount;

        const totalPage = Math.ceil(parseInt(total) / (limit ? limit : 10));

        if (page > totalPage) {
            throw new Error("Page out of range");
        }

        if (page !== null && limit !== null) {
            const offset = (page ? page : 0) * (limit ? limit : 10);
            query += "AND posts.id < (SELECT id FROM posts ORDER BY id DESC LIMIT ?, 1) ";
            params.push(offset);
        }

        query += expiredDateCondition() +
            "GROUP BY posts.id " +
            `${provinceIds.length > 1 ? "ORDER BY FIELD(provinces.id, " +
                provinceIds.map(() => "?").join(", ") + "), posts.id DESC " : " ORDER BY posts.id DESC "}` +
            `${limit ? " LIMIT ?" : ""}`;

        if (limit !== null) {
            params.push(limit);
        }

        const res = await executeQuery(query, params);

        return {
            data: res ? res : null,
            currentPage: page ? page : 0,
            totalPage,
        };
    } catch (error) {
        logging.error(
            "Read newest accepted posts by provinces service has error: ",
            error
        );
        throw error;
    }
};

export default readNewestAcceptedPostsByProvinces;
