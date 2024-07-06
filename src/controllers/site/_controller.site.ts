import signOutController from "./controller.site.signOut";
import adminSignOutController from "./controller.site.adminSignOut";
import resetAccessTokenController from "./controller.site.resetAccessToken";

const siteController = {
    signOut: signOutController,
    adminSignOut: adminSignOutController,
    resetAccessToken: resetAccessTokenController,
};

export default siteController;
