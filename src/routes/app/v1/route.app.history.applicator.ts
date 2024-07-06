import { Router } from "express";
import verifyAccessToken from "../../../middlewares/middleware.verifyAccessToken";
import historyApplicatorController from "../../../controllers/history/applicator/_controller.history.applicator";
import { checkLimitAndThresholdParams } from "../../../middlewares/utils/midleware.checkUtilsParams";
import checkIsActiveMiddleware from "../../../middlewares/middleware.checkIsActive";
const router = Router();

// applicator
router.get(
    "/applications",
    checkIsActiveMiddleware,
    verifyAccessToken,
    checkLimitAndThresholdParams,
    historyApplicatorController.readSubmittedApplications
); // read all post and quantity of applications

router.get(
    "/applications/:application_id",
    verifyAccessToken,
    checkIsActiveMiddleware,
    historyApplicatorController.readApplicationById
); // read all applications by post id

// router.get(
//     "/:post_id/applications/:application_id",
//     verifyAccessToken,
//     historyRecruiterController.readApplicationsByApplicationId
// ); // read application by application id

export default router;