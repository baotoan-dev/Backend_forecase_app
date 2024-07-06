import express from "express";
import bookmarkController from "../../../controllers/bookmark/_controller.bookmark";
import verifyAccessToken from "../../../middlewares/middleware.verifyAccessToken";
import checkIsActiveMiddleware from "../../../middlewares/middleware.checkIsActive";

const router = express.Router();

router.post(
  "/",
  checkIsActiveMiddleware,
  verifyAccessToken,
  bookmarkController.create
);
router.delete(
  "/",
  checkIsActiveMiddleware,
  verifyAccessToken,
  bookmarkController.delete
);

export default router;
