import * as createApplicationService from "./create/_service.application.create";
import * as readApplicationService from "./read/_service.application.read";
import * as updateApplicationService from "./update/_service.application.update";
import * as deleteApplicationService from "./delete/_service.application.delete";
import * as totalApplicationService  from "./total/_service.application.total";
import * as totalApplicationCandidateService from "./total/service.application.total-apply-candidate";

const applicationService = {
    create: createApplicationService,
    read: readApplicationService,
    update: updateApplicationService,
    delete: deleteApplicationService,
    total: totalApplicationService,
    totalApplyCandidate: totalApplicationCandidateService,
}

export default applicationService;