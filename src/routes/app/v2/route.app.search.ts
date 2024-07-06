import { Router } from 'express';
import searchController from '../../../controllers/search/_controller.search';
const router = Router();

//SEARCH
router.get(
    '',
    searchController.search
);
// router.get(
//     '/filter',
//     // verifyAccessToken, 
//     searchController.filter
// );

export default router;