import checkSignInWithPhoneRequest from "./middleware.signIn.checkSignInWithPhoneRequest";
import checkSignInWithEmailRequest from "./middleware.signIn.checkSignInWithEmailRequest";

const signInMiddleware = {
    checkSignInWithPhoneRequest: checkSignInWithPhoneRequest,
    checkSignInWithEmailRequest: checkSignInWithEmailRequest,
};

export default signInMiddleware;
