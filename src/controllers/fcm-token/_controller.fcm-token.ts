import deleteFcmTokenForAccountController from "./controller.fcm-token.delete";
import createFcmTokenForAccountController from "./controller.fcm-token.register";

const fcmTokenController = {
    createFcmTokenController: createFcmTokenForAccountController,
    deleteFcmTokenController: deleteFcmTokenForAccountController
};

export default fcmTokenController;