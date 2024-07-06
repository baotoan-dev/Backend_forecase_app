import { Router } from 'express';
import searchController from '../../../controllers/search/_controller.search';
import verifyAccessToken from '../../../middlewares/middleware.verifyAccessToken';
import checkAccessToken from '../../../middlewares/middleware.checkAccessToken';
const router = Router();

//SEARCH
router.get(
    '',
    checkAccessToken,
    searchController.search
);
// router.get(
//     '/filter',
//     // verifyAccessToken, 
//     searchController.filter
// );

router.get(
    '/history',
    verifyAccessToken,
    searchController.readHistorySearch
);

router.delete(
    '/history',
    verifyAccessToken,
    searchController.deleteHistorySearch
);

router.delete(
    '/history/all',
    verifyAccessToken,
    searchController.deleteAllHistorySearch
)

router.get(
    '/suggest',
    // verifyAccessToken,
    searchController.readSuggestedListSearch
)

export default router;