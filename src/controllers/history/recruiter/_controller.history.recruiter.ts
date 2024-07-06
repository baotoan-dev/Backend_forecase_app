import createRateForApplicationController from "../applicator/controller.history.applicator.createRateForJob";
import readAcceptedApplicationsByRecruiterId from "./controller.history.recruiter.readAcceptedApplications";
import readApplicationByIdController from "./controller.history.recruiter.readApplicationById";
import readApplicationsByPostIdController from "./controller.history.recruiter.readApplicationsByPostId";
import readPostedJobByRecruiterIdController from "./controller.history.recruiter.readPostedJob";
import readQuantityApplicationOfAllPostsController from "./controller.history.recruiter.readQuantityApplicationsOfAllPosts";

const historyRecruiterController = {
    readQuantityApplicationsOfAllPosts: readQuantityApplicationOfAllPostsController,
    readApplicationByPostId: readApplicationsByPostIdController,
    readApplicationsByApplicationId: readApplicationByIdController,
    readAllPostedJobs: readPostedJobByRecruiterIdController,
    // readAcceptedApplicationsByRecruiterId: readAcceptedApplicationsByRecruiterId,
    createRateForApplicator: createRateForApplicationController,
};


export default historyRecruiterController;