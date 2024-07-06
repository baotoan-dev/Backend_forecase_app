import verifyPhoneNumberOtpController from "./controller.signIn.verifyPhoneNumber";
import signInWithEmailController from "./emailAndGoogle/controller.signIn.email";
import verifyEmailOtpController from "./emailAndGoogle/controller.signIn.verifyEmailOtp";
import resendEmailController from "./emailAndGoogle/controller.signIn.resendEmail";
import signInWithPhoneController from "./controller.signIn.phone";
import signInWithGoogleController from "./emailAndGoogle/controller.signIn.google";
import resendPhoneOTPController from "./controller.signIn.resendPhone";
import signInWithFacebook from "./controller.signIn.facebook";
import adminSignInController from "./controller.signIn.admin";
import signInWithAppleIdController from "./controller.signIn.apple";
import recruiterSignInController from "./controller.signIn.recruiter";
import candidateSignInController from "./controller.signIn.candidate";
import modifyPasswordRecruiterController from "./controller.signIn.modifyPasswordRecruiter";

const signInController = {
    signInWithEmail: signInWithEmailController,
    signInWithFacebook: signInWithFacebook,
    signInWithGoogle: signInWithGoogleController,
    signInWithPhone: signInWithPhoneController,
    signInWithAppleId: signInWithAppleIdController,
    resendEmail: resendEmailController,
    resendPhoneOTP: resendPhoneOTPController,
    verifyPhoneOtp: verifyPhoneNumberOtpController,
    verifyEmailOtp: verifyEmailOtpController,
    adminSignIn: adminSignInController,
    recruiterSignIn: recruiterSignInController,
    candidateSignIn: candidateSignInController,
    modifyPassword: modifyPasswordRecruiterController,
};

export default signInController;
