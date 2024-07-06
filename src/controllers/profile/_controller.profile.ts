import readProfileByIdController from "./personal/controller.profile.readById";
import updatePersonalInformationController from "./personal/controller.profile.updatePersonalInformation";
import updateContactInformationController from "./personal/controller.profile.updateContactInformation";
import updateCategoriesController from "./categories/controller.profile.updateCategories";
import updateLocationsOfProfileController from "./personal/controller.profile.updateLocations";
import createEducationController from "./educations/controller.profile.createEducation";
import updateEducationController from "./educations/controller.profile.updateEducation";
import deleteEducationController from "./educations/controller.profile.deleteEducation";
import createExperienceController from "./experience/controller.profile.createExperience";
import updateExperienceController from "./experience/controller.profile.updateExperience";
import deleteExperienceController from "./experience/controller.profile.deleteExperience";
import updateAvatarController from "./avatar/controller.profile.updateAvatar";
import createCVProfileController from "./cv/controller.profile.createCv";
import updateCVProfileController from "./cv/controller.profile.updateCv";
import deleteCVProfileController from "./cv/controller.profile.deleteCv";

const profileController = {
    readById: readProfileByIdController,
    updatePersonalInformation: updatePersonalInformationController,
    updateContactInformation: updateContactInformationController,
    updateCategories: updateCategoriesController,
    updateLocations: updateLocationsOfProfileController,
    createEducation: createEducationController,
    updateEducation: updateEducationController,
    deleteEducation: deleteEducationController,
    createExperience: createExperienceController,
    updateExperience: updateExperienceController,
    deleteExperience: deleteExperienceController,
    updateAvatar: updateAvatarController,
    createCv: createCVProfileController,
    updateCv: updateCVProfileController,
    deleteCv: deleteCVProfileController,
};

export default profileController;
