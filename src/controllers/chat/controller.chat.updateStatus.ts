import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import logging from "../../utils/logging";
import * as chatServices from "../../services/chat/_service.chat";

const updateStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Update messages status controller start ...");
        if (!req.user || !req.user.id) {
            return next(createError(401));
        }

        const id = req.user.id;

        // Get chat id
        const chatIds = req.body.chatIds;

        if (!chatIds) {
            logging.warning("Invalid chat ids");
            return next(createError(400));
        }

        let isValidChatId = false;
        chatIds.forEach((chatId) => {
            if (!Number.isInteger(chatId)) {
                isValidChatId = true;
                return;
            }
        });
        if (isValidChatId) {
            logging.warning("Invalid chat id");
            return next(createError(400));
        }

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Update messages status controller has error: ", error);
        return next(createError(500));
    }
};

export default updateStatusController;
