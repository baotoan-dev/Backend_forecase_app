import readProfileByIdController from "./personal/controller.profile.readById";
import updatePersonalInformationController from "./personal/controller.profile.updatePersonalInformation";
import updateContactInformationController from "./personal/controller.profile.updateContactInformation";
import updateAvatarController from "./avatar/controller.profile.updateAvatar";

const profileController = {
    readById: readProfileByIdController,
    updatePersonalInformation: updatePersonalInformationController,
    updateContactInformation: updateContactInformationController,
    updateAvatar: updateAvatarController,
};

export default profileController;
