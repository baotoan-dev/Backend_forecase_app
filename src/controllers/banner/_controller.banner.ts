import createBannerController from "./controller.banner.create";
import updateBannerController from "./controller.banner.update";
import updateBannersStatusController from "./controller.banner.updateBannersStatus";
import readEnabledBannersController from "./controller.banner.readEnabledBanners";
import readAllBannersController from "./controller.banner.readAllBanners";
import deleteBannersController from "./controller.banner.deleteBanners";

const bannerController = {
    create: createBannerController,
    update: updateBannerController,
    updateBannersStatus: updateBannersStatusController,
    readAllBanners: readAllBannersController,
    readEnabledBanners: readEnabledBannersController,
    deleteBanners:deleteBannersController,
};

export default bannerController;
