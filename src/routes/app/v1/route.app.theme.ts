import express from "express";
import themeController from "../../../controllers/theme/_controller.theme";
import { multerUploadImages } from "../../../configs/multer";
import verifyAccessToken from "../../../middlewares/middleware.verifyAccessToken";

const router = express.Router();

router.get("/all", verifyAccessToken, themeController.readAllThemes); // ADMIN ROLE

router.get("/enabled", themeController.readEnabledThemes);

router.post("/add-posts", verifyAccessToken, themeController.addPostsToTheme); // ADMIN ROLE

router.post("/", multerUploadImages, themeController.create); // ADMIN ROLE

router.put("/status", verifyAccessToken, themeController.updateThemesStatus); // ADMIN ROLE

router.put("/", multerUploadImages, themeController.update); // ADMIN ROLE

export default router;
