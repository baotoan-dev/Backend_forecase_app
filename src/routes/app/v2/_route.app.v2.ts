import { Router } from "express";
import searchByQueryV2Controller from "../../../controllers/search/v2/controller.search.byQuery";
import checkAccessToken from "../../../middlewares/middleware.checkAccessToken";
import notificationController from "../../../controllers/notification/RESTful/_controller.notification";

const routeV2 = Router();

routeV2.use(
    "/search",
    checkAccessToken,
    searchByQueryV2Controller
);
routeV2.use(
    "/notification/all",
    checkAccessToken,
    notificationController.readByAccountIdV2
);
export default routeV2;