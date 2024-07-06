import express from "express";
import signInController from "../../../controllers/signIn/_controller.signIn";
import profileController from "../../../controllers/profile/_controller.profile";
import verifyAccessToken from "../../../middlewares/middleware.verifyAccessToken";

const router = express.Router();

router.post(
    "/sign-up",
    verifyAccessToken,
    signInController.signUp,
)

router.get("/profiles", verifyAccessToken ,profileController.readById);


export default router;
