import { Router } from 'express';
import notificationController from '../../../controllers/notification/RESTful/_controller.notification';
import verifyAccessToken from '../../../middlewares/middleware.verifyAccessToken';
import checkIsActiveMiddleware from '../../../middlewares/middleware.checkIsActive';
const router = Router();

router.get('/all',
    checkIsActiveMiddleware,
    verifyAccessToken,
    notificationController.readByAccountId
);

router.get('/companies', 
    verifyAccessToken,
    notificationController.readNotificationCompanies
)

router.get('/new',
    verifyAccessToken,
    notificationController.readQuantityOfNewNotifications
);


router.put('/update',
    checkIsActiveMiddleware,
    verifyAccessToken,
    notificationController.updateStatus
);

router.get(
    '/keyword',
    checkIsActiveMiddleware,
    verifyAccessToken,
    notificationController.keyword.read
);

router.post(
    '/keyword', 
    checkIsActiveMiddleware,
    verifyAccessToken,
    notificationController.keyword.create
);

router.put(
    '/keyword/update-status',
    checkIsActiveMiddleware,
    verifyAccessToken,
    notificationController.keyword.updateStatus
);

router.delete(
    '/keyword/delete',
    checkIsActiveMiddleware,
    verifyAccessToken,
    notificationController.keyword.delete
);

router.put(
    '/update-platform',
    checkIsActiveMiddleware,
    verifyAccessToken,
    notificationController.updateTypeOfNotificationPlatform
)

export default router;