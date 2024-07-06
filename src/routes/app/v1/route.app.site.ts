import express from "express";
import siteController from "../../../controllers/site/_controller.site";

const router = express.Router();

router.post("/sign-out", siteController.signOut); // Admin role
router.post("/admin/sign-out", siteController.adminSignOut); // Admin role
router.post("/reset-access-token", siteController.resetAccessToken);
export default router;
