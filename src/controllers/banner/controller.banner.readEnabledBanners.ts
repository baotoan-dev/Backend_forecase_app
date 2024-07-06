import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import logging from "../../utils/logging";
import * as bannerServices from "../../services/banner/_service.banner";
import { formatBannerResponse } from "./handler/formatBannerResponse";
import ImageBucket from "../../models/enum/imageBucket.enum";
import { shuffle } from "../../utils/shuffleArray";

const readEnabledBannersController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Read enabled banners controller start ...");

        const version = +req.query.v;
        if (!Number.isInteger(version)) {
            return next(createError(400));
        }

        // GET BANNERS
        let banners = await bannerServices.readEnabledBanners(version);
        if (!banners) {
            return next(createError(500));
        }

        banners.forEach((banner) => {
            banner.image = `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.BANNER_IMAGES}/` + banner.image;
        });

        banners = shuffle(banners);

        // FORMAT RESPONSE
        // 

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: banners,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Read enabled banners controller has error: ", error);
        return next(createError(500));
    }
};

export default readEnabledBannersController;
