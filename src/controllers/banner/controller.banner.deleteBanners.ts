import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import logging from "../../utils/logging";
import ImageBucket from "../../models/enum/imageBucket.enum";

const deleteBannersController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Delete banners controller start ...");
    
        let imageName = req.body.imageName ? req.body.imageName : [];
        let id = req.body.id ? req.body.id : ''
    
        if (imageName.length > 0) {
            imageName = imageName.map(image => ImageBucket.BANNER_IMAGES + "/" + image);
        }

        try {

            return res.status(200).json({
                code: 200,
                success: true,
                message: "Successfully",
            });

        } catch (error) {
            logging.error("Delete banner controller has error: ", error);
            return next(createError(500));
        }
      
    } catch (error) {
        logging.error("Delete enabled banners controller has error: ", error);
        return next(createError(500));
    }
    
};

export default deleteBannersController;
