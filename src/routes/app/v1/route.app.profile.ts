import express from "express";
import profileController from "../../../controllers/profile/_controller.profile";
import verifyAccessTokenMiddleware from "../../../middlewares/middleware.verifyAccessToken";
import { multerUploadImages, multerUploadPdf } from "../../../configs/multer";

const router = express.Router();
// READ
router.get("/s", verifyAccessTokenMiddleware, profileController.readById);

// UPDATE
router.put(
    "/per",
    verifyAccessTokenMiddleware,
    profileController.updatePersonalInformation
);

router.put(
    "/avt",
    verifyAccessTokenMiddleware,
    multerUploadImages,
    profileController.updateAvatar
);


export default router;
