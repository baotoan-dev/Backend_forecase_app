import express from "express";
import accountController from "../../../controllers/account/_controller.account";
import verifyAccessToken from "../../../middlewares/middleware.verifyAccessToken";
import homeAdminController from "../../../controllers/homeAdmin/_controller.homeAdmin";
import getImageFromS3 from "../../../controllers/homeAdmin/handleImage/controller.getImageFromS3";

const router = express.Router();

router.get("/today", verifyAccessToken, accountController.readTodayAccounts);
router.get("/", verifyAccessToken, accountController.readAccounts);
// search for accounts
router.get("/search", verifyAccessToken, accountController.searchAccounts);
// search for accounts today
router.get("/search/today", verifyAccessToken, accountController.searchTodayAccounts);
router.delete("/delete/:id", verifyAccessToken, accountController.deleteAccount);
router.get("/count", verifyAccessToken, homeAdminController.counter);

router.get("/image", getImageFromS3);

export default router;
