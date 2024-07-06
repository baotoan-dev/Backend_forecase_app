import express from 'express';
import verifyAccessToken from '../../../middlewares/middleware.verifyAccessToken';
import analyticAppController from '../../../controllers/analytic/app/_controller.app';

const router = express.Router();

router.get('/read', verifyAccessToken, analyticAppController.readAnalyticApp);

export default router;


