import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";
import { expiredDateCondition, initQueryReadPost, initQueryCountPost } from "./_service.post.initQuery";

const readAcceptedPostsByTheme = async (
    lang: string = "vi",
    themeId: number,
    page: number,
    limit: number
) => {
    try {
        logging.info("Read accepted posts by theme service start ...");

        const offset = (page) * limit;

        const countQuery = 
            initQueryCountPost() + 
            "INNER JOIN themes ON themes.id = ? " +
            "WHERE posts.status = ? " +
            expiredDateCondition() +
            "AND districts.id = themes.district_id " 
        ;
    
        const countParams = [themeId, 1];
        const totalCountRes = await executeQuery(countQuery, countParams);
        const totalCount = totalCountRes ? parseInt(totalCountRes[0].totalCount) : 0;

        const totalPage = Math.ceil(totalCount / limit);

        let query =
            initQueryReadPost(lang) +
            "INNER JOIN themes ON themes.id = ? " +
            "WHERE posts.status = ? " +
            expiredDateCondition() +
            "AND districts.id = themes.district_id " +
            "ORDER BY posts.id DESC LIMIT ?, ?";
        const params = [themeId, 1, offset, limit];

        const res = await executeQuery(query, params);

        const currentPage = Math.min(page, totalPage);

        return {
            currentPage,
            totalPage,
            posts: res ? res : []
        };
    } catch (error) {
        logging.error(
            "Read accepted posts by theme service has error: ",
            error
        );
        throw error;
    }
};

export default readAcceptedPostsByTheme;

