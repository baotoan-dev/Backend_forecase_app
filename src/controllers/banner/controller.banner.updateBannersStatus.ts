import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import logging from "../../utils/logging";
import * as bannerServices from "../../services/banner/_service.banner";

const updateBannersStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Update banners status controller start ...");

        // GET BANNERS
        const newBanners = req.body.banners ? req.body.banners : [];
        if (newBanners.length <= 0) {
            logging.warning("Invalid banners data");
            return next(createError(400));
        }

        // GET ALL CURRENT BANNERS IN DB
        const allBanners = await bannerServices.readAllBanners();

        // GET ALL BANNERS WILL BE UPDATED
        const bannersWillBeUpdated = newBanners.filter((newBanner) => {
            return (
                allBanners.findIndex(
                    (banner) =>
                        banner.id === newBanner.id &&
                        banner.status === newBanner.status
                ) < 0
            );
        });

        // GET ENABLED BANNER IDS
        const enabledBannerIdsWillBeUpdated = bannersWillBeUpdated
            .filter((banner) => banner.status === 1)
            .map((banner) => banner.id);

        // GET DISABLED BANNER IDS
        const disabledBannerIdsWillBeUpdated = bannersWillBeUpdated
            .filter((banner) => banner.status === 0)
            .map((banner) => banner.id);

        // HANDLE UPDATE BANNERS STATUS
        if (enabledBannerIdsWillBeUpdated.length > 0) {
            const isUpdateSuccess = await bannerServices.updateBannersStatus(
                enabledBannerIdsWillBeUpdated,
                1
            );
            if (!isUpdateSuccess) {
                logging.warning("Update banners status to 1 failure");
                return next(createError(500));
            }
        }

        if (disabledBannerIdsWillBeUpdated.length > 0) {
            const isUpdateSuccess = await bannerServices.updateBannersStatus(
                disabledBannerIdsWillBeUpdated,
                0
            );
            if (!isUpdateSuccess) {
                logging.warning("Update banners status to 1 failure");
                return next(createError(500));
            }
            if (!isUpdateSuccess) {
                logging.warning("Update banners status to 0 failure");
                return next(createError(500));
            }
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Update banners status controller has error: ", error);
        return next(createError(500));
    }
};

export default updateBannersStatusController;
