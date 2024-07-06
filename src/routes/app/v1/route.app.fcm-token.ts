import { Router } from "express";
import fcmTokenController from "../../../controllers/fcm-token/_controller.fcm-token";
import verifyAccessToken from "../../../middlewares/middleware.verifyAccessToken";
const router = Router();

// register fcm token
router.post(
    "/register/:token",
    verifyAccessToken,
    fcmTokenController.createFcmTokenController
); // read all post and quantity of applications

router.delete(
    "/delete/:token",
    verifyAccessToken,
    fcmTokenController.deleteFcmTokenController
); // read all applications by post id

export default router;