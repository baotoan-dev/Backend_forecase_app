import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import logging from "../../utils/logging";
import * as chatServices from "../../services/chat/_service.chat";

const getQuantityUnreadChatsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Get quantity of unread chats ...");
        if (!req.user || !req.user.id) {
            return next(createError(401));
        }

        const id = req.user.id;

        const quantity =  parseInt(await chatServices.getUnreadChatsById(id)) || 0;
        
        return res.status(200).json({
            code: 200,
            success: true,
            data: {
                quantity,
            },
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Get quantity of unread chats: ", error);
        return next(createError(500));
    }
};

export default getQuantityUnreadChatsController;
