import verifyEmailOtpController from "./emailAndGoogle/controller.signIn.verifyEmailOtp";
import resendEmailController from "./emailAndGoogle/controller.signIn.resendEmail";
import signInWithGoogleController from "./emailAndGoogle/controller.signIn.google";
import signInWithFacebook from "./controller.signIn.facebook";
import candidateSignInController from "./controller.signIn.candidate";
import modifyPasswordRecruiterController from "./controller.signIn.modifyPasswordRecruiter";
import signUpController from "./controller.signUp";
import forgotPasswordController from "./controller.signIn.forgotPassword";

const signInController = {
    signInWithFacebook: signInWithFacebook,
    signInWithGoogle: signInWithGoogleController,
    resendEmail: resendEmailController,
    verifyEmailOtp: verifyEmailOtpController,
    candidateSignIn: candidateSignInController,
    modifyPassword: modifyPasswordRecruiterController,
    signUp: signUpController,
    forgotPassword: forgotPasswordController,
};

export default signInController;
