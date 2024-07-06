import readApplicationByIdController from "./controller.history.applicator.readApplicationById";
import readSubmittedApplicationByAccountId from "./controller.history.applicator.readSubmittedApplicationByAccountId";

const historyApplicatorController = {
    readApplicationById: readApplicationByIdController,
    readSubmittedApplications: readSubmittedApplicationByAccountId,
}

export default historyApplicatorController;