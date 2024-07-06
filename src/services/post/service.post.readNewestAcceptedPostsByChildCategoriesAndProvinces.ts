import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { expiredDateCondition, initQueryCountPost, initQueryReadPost } from "./_service.post.initQuery";

const readNewestAcceptedPostsByChildCategoriesAndProvinces = async (
    lang: string,
    childCategoryIds: number[],
    provinceIds: string[],
    limit: number | 10,
    page: number | 0,
    search: string | null
) => {
    try {
        logging.info(
            "Read newest accepted posts by child categories and provinces service start ..."
        );

        let query =
            initQueryReadPost(lang) +
            "LEFT JOIN posts_categories ON posts_categories.post_id = posts.id " +
            "WHERE posts.status = ? " +
            "AND posts_categories.category_id IN " +
            `(${childCategoryIds.map(() => "?").join(", ")}) ` +
            `${search ? "AND posts.title LIKE '%" + search + "%' " : ""}` +
            "OR wards.id IN " +
            `(${provinceIds.map(() => "?").join(", ")}) `;

        const params = [
            1,
            ...childCategoryIds,
            ...provinceIds
        ];

        // Count total records for pagination
        const countQuery = initQueryCountPost() +
            "LEFT JOIN posts_categories ON posts_categories.post_id = posts.id " +
            "WHERE posts.status = ? " +
            "AND posts_categories.category_id IN " +
            `(${childCategoryIds.map(() => "?").join(", ")}) ` +
            `${search ? "AND posts.title LIKE '%" + search + "%' " : ""}` +
            "OR wards.id IN " +
            `(${provinceIds.map(() => "?").join(", ")}) `;

        const countParams = [1,
            ...childCategoryIds,
            ...provinceIds];

        let total = await executeQuery(countQuery, countParams);

        let totalPost = total[0].totalCount;

        total = total[0].totalCount;

        const totalPage = Math.ceil(parseInt(total) / (limit ? +limit : 10));

        if (page > totalPage) {
            throw new Error("Page out of range");
        }

        query += expiredDateCondition() +
            "GROUP BY posts.id " +
            "ORDER BY posts.id DESC "

        const offset = (page ? +page : 0) * (limit ? +limit : 10);

        query += "LIMIT ? OFFSET ?";

        params.push(limit ? +limit : 10, offset);

        const res = await executeQuery(query, params);

        return {
            data: res ? res : null,
            currentPage: page ? page : 0,
            totalPage,
            totalPost: totalPost
        };
    } catch (error) {
        logging.error(
            "Read newest accepted posts by child categories and provinces service has error: ",
            error
        );
        throw error;
    }
};

export default readNewestAcceptedPostsByChildCategoriesAndProvinces;
