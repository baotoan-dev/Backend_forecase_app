import express from "express";
import chatController from "../../../controllers/chat/_controller.chat";
import verifyAccessToken from "../../../middlewares/middleware.verifyAccessToken";
import { multerUploadImages } from "../../../configs/multer";
import checkIsActiveMiddleware from "../../../middlewares/middleware.checkIsActive";

const router = express.Router();

router.get("/users", checkIsActiveMiddleware, verifyAccessToken, chatController.getUsersChated);
router.get("/messages",checkIsActiveMiddleware, verifyAccessToken, chatController.getPostChats);
router.put("/status", checkIsActiveMiddleware, verifyAccessToken, chatController.updateStatus);
router.get("/unread", checkIsActiveMiddleware, verifyAccessToken, chatController.getUnreadChats);
router.post("/upload-image", checkIsActiveMiddleware, verifyAccessToken, multerUploadImages, chatController.uploadImageChat);

export default router;
