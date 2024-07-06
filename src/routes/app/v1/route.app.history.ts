import { Router } from "express";
import historyRecruiterRouter from "./route.app.history.recruiter";
import historyApplicatorRouter from "./route.app.history.applicator";
import verifyAccessToken from "../../../middlewares/middleware.verifyAccessToken";
import readAllByAccountId from "../../../controllers/history/controller.history.readAllByAccountId";
const router = Router();

// recruiter
router.use("/recruiter", historyRecruiterRouter);
router.use("/applicator", historyApplicatorRouter);
router.get(
    "/all",
    verifyAccessToken,
    readAllByAccountId
)

export default router;