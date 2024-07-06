import { Request, Response, NextFunction } from "express"; 
import createError from "http-errors";
import logging from "../../utils/logging";
import * as fcmTokenServices from "../../services/fcm-token/_service.fcm-token";


const deleteFcmTokenForAccountController = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;
    try {
        logging.info("Delete fcm token for account controller start ...");
        const { token: fcmToken } = req.params;
        if (!fcmToken) {
            logging.warning("Invalid fcm token");
            return next(createError(400, "Invalid fcm token"));
        }
        if (typeof fcmToken !== "string") {
            logging.warning("Invalid fcm token");
            return next(createError(400, "Invalid fcm token"));
        }

        const result = await fcmTokenServices.deleteFcmTokenService(id, fcmToken);

        if (!result) {
            logging.warning("Delete fcm token failed");
            return next(createError(500, "Delete fcm token failed"));
        }

        res.status(200).json({
            code: 200,
            message: "Delete fcm token successfully",
            data: {},
            success: true
        });

       
    } catch (error) {
        next(createError(500, "Internal server error"));
    }
}

export default deleteFcmTokenForAccountController;