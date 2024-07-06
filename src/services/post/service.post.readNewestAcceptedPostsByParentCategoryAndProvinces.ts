import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { expiredDateCondition, initQueryCountPost, initQueryReadPost } from "./_service.post.initQuery";

const readNewestAcceptedPostsByParentCategoryAndProvinces = async (
    lang: string,
    accountId: string,
    parentCategoryId: number,
    provinceIds: string[],
    limit: number | null,
    page: number | null
) => {
    try {
        logging.info(
            "Read newest accepted posts by parent category and provinces service start ..."
        );

        let query =
            initQueryReadPost(lang) +
            "LEFT JOIN posts_categories " +
            "ON posts_categories.post_id = posts.id " +
            "LEFT JOIN child_categories " +
            "ON child_categories.id = posts_categories.category_id " +
            "LEFT JOIN parent_categories " +
            "ON parent_categories.id = child_categories.parent_category_id " +
            "WHERE posts.status = ? AND parent_categories.id = ? " +
            "AND district_id NOT IN (SELECT location_id FROM profiles_locations WHERE account_id = ?) " +
            `${provinceIds.length > 0 ? `AND provinces.id IN (${provinceIds.map(() => `?`).join(", ")})` : ""}`;

        const params = [1, parentCategoryId, accountId, ...provinceIds];

        // Count total records for pagination
        const countQuery = initQueryCountPost() +
            "LEFT JOIN posts_categories " +
            "ON posts_categories.post_id = posts.id " +
            "LEFT JOIN child_categories " +
            "ON child_categories.id = posts_categories.category_id " +
            "LEFT JOIN parent_categories " +
            "ON parent_categories.id = child_categories.parent_category_id " +
            "WHERE posts.status = ? AND parent_categories.id = ? " +
            "AND district_id NOT IN (SELECT location_id FROM profiles_locations WHERE account_id = ?) " +
            `${provinceIds.length > 0 ? `AND provinces.id IN (${provinceIds.map(() => `?`).join(", ")})` : ""}`;

        const countParams = [1, parentCategoryId, ...provinceIds, accountId];

        let total = await executeQuery(countQuery, countParams);

        total = total[0].totalCount;

        const totalPage = Math.ceil(parseInt(total) / (limit ? limit : 10));

        if (page > totalPage) {
            throw new Error("Page out of range");
        }

        if (page !== null && limit !== null) {
            const offset = (page ? page : 0) * (limit ? limit : 10);
            query += " AND posts.id < (SELECT id FROM posts ORDER BY id DESC LIMIT ?, 1)";
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
            "Read newest accepted posts by parent category and provinces service has error: ",
            error
        );
        throw error;
    }
};

export default readNewestAcceptedPostsByParentCategoryAndProvinces;
