import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import logging from "../../utils/logging";
import checkAppVersionValidService from "../../services/appVersion/service.appVersion.checkAppVersion";

const checkAppVersionValidController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { version, platform } = req.query;

        if (!version) {
            return next(createHttpError(400, "Version is required"));
        }

        if (platform !== "android" && platform !== "ios") {
            return next(createHttpError(400, "Platform is invalid"));
        }

        // Check app version
        const isForceUpdate = await checkAppVersionValidService(version as string, platform as string);

        return res.status(200).json({
            status_code: 200,
            data: {
                is_force_update: isForceUpdate
            },
            message: "Success"
        });
    } catch (error) {
        logging.error(error);
        return next(createHttpError(500, "Internal server error"));
    }
}

export default checkAppVersionValidController;