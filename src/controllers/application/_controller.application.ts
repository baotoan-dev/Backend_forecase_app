import createApplicationController from "./controller.application.create";
import deleteApplicationController from "./controller.application.delete";
import updateLikeStatusApplicationController from "./controller.application.like";
import totalApplicationController from "./controller.application.total";
import totalApplicationRecruiterController from "./controller.application.total-recruiter";
import updateApplicationController from "./controller.application.update";

const applicationController = {
    createApplication: createApplicationController,
    updateApplication: updateApplicationController,
    deleteApplication: deleteApplicationController,
    updateLikeStatus: updateLikeStatusApplicationController,
    totalApplication: totalApplicationController,
    totalRecruiterApplication: totalApplicationRecruiterController,
}


export default applicationController;