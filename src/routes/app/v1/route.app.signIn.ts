import express from "express";
import signInController from "../../../controllers/signIn/_controller.signIn";
import handlerSignInSuccessful from "../../../controllers/signIn/emailAndGoogle/controller.signIn.success";
import verifyAccessToken from "../../../middlewares/middleware.verifyAccessToken";

const router = express.Router();


router.post(
    "/email/verify",
    signInController.verifyEmailOtp,
    handlerSignInSuccessful
);
router.post(
    "/email/resend",
    signInController.resendEmail
);

router.post(
    "/google",
    signInController.signInWithGoogle,
    handlerSignInSuccessful
);

router.post(
    "/sign-up",
    signInController.signUp,
)

// // modify password
router.post("/modify-password", verifyAccessToken, signInController.modifyPassword);

router.post("/facebook", signInController.signInWithFacebook);

router.post("/user", signInController.candidateSignIn);

export default router;
