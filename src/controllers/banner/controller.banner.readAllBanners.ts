import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import logging from "../../utils/logging";
import * as bannerServices from "../../services/banner/_service.banner";
import { formatBannerResponse } from "./handler/formatBannerResponse";
import ImageBucket from "../../models/enum/imageBucket.enum";

const readAllBannersController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Read all banners controller start ...");

        // READ ALL BANNERS
        const banners = await bannerServices.readAllBanners();
        if (!banners) {
            return next(createError(500));
        }

        banners.forEach((banner) => {
            banner.image = `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.BANNER_IMAGES}/` + banner.image;
        });        

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: banners,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Read all banners controller has error: ", error);
        return next(createError(500));
    }
};

export default readAllBannersController;
