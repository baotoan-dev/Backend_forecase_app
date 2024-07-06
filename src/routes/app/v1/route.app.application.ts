import { Router } from "express";
const router = Router();
import applicationController from "../../../controllers/application/_controller.application";
import verifyAccessToken from "../../../middlewares/middleware.verifyAccessToken";
import checkIsActiveMiddleware from "../../../middlewares/middleware.checkIsActive";

router.post(
  "/create",
  checkIsActiveMiddleware,
  verifyAccessToken,
  applicationController.createApplication
);
router.put(
  "/update",
  checkIsActiveMiddleware,
  verifyAccessToken,
  applicationController.updateApplication
);
router.put(
  "/like",
  checkIsActiveMiddleware,
  verifyAccessToken,
  applicationController.updateLikeStatus
);
router.delete(
  "/delete",
  checkIsActiveMiddleware,
  verifyAccessToken,
  applicationController.deleteApplication
);
router.get("/total", verifyAccessToken, applicationController.totalApplication);
// recruiter
router.get(
  "/total/recruiter",
  verifyAccessToken,
  applicationController.totalRecruiterApplication
);

export default router;
