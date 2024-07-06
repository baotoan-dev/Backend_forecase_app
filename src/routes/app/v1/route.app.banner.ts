import express from "express";
import bannerController from "../../../controllers/banner/_controller.banner";
import { multerUploadImages } from "../../../configs/multer";
import verifyAccessToken from "../../../middlewares/middleware.verifyAccessToken";

const router = express.Router();

router.post(
    "/",
    verifyAccessToken,
    multerUploadImages,
    bannerController.create
); // ADMIN

router.put(
    "/status/many",
    verifyAccessToken,
    bannerController.updateBannersStatus
); // ADMIN

router.put("/", verifyAccessToken, multerUploadImages, bannerController.update);

router.get("/all", verifyAccessToken, bannerController.readAllBanners); // ADMIN
router.get("/ena", bannerController.readEnabledBanners);
router.post("/delete", verifyAccessToken, bannerController.deleteBanners); // ADMIN

export default router;
