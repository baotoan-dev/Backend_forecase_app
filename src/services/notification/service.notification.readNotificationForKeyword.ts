import logging from '../../utils/logging';
import { executeQuery } from '../../configs/database/database';
import { initQueryReadPost } from '../post/_service.post.initQuery';

const readNotificationForKeywordService = async (
    account_id: string,
    // post_id: string,
    lang: string = "vi",
) => {
    try {
        const query = initQueryReadPost(lang) +
        `
            INNER JOIN post_notification
            ON post_notification.post_id = posts.id
            WHERE post_notification.account_id = ?
  
        `;
            
        const params = [account_id];

        const result = await executeQuery(query, params);
        
        return result;
    } catch (error) {
        logging.error(error);
        return null;
    }
}

export default readNotificationForKeywordService;