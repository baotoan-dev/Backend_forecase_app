import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import logging from "../../utils/logging";
import * as chatServices from "../../services/chat/_service.chat";
import * as chatImageServices from "../../services/chatImage/_service.chatImage";
import ImageBucket from "../../models/enum/imageBucket.enum";

const getPostChatsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Get post chats controller start ...");
        if (!req.user || !req.user.id) {
            return next(createError(401));
        }

        const id = req.user.id;

        // Get user id and post id
        const uid = req.query.uid ? req.query.uid.toString().trim() : null;
        const pid = +req.query.pid;

        if (!uid || !Number.isInteger(pid)) {
            logging.warning("Invalid query parameters");
            return next(createError(400));
        }

        // Update status of chat messages to 1
        await chatServices.updateMessagesStatus(uid, id, 1);

        // Get users chated
        const postChats = await chatServices.getChatMessages(id, uid, pid);

        // GET CHAT IMAGES
        await Promise.all(
            postChats.map(async (chat) => {
                chat.created_at = +chat.created_at;
                chat.is_sender = chat.sender_id === id;
                
                // if (chat.type === "image") {
                //     const image = await chatImageServices.readChatImages(
                //         chat.id
                //         );
                //         chat.image = image && image[0] ? `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.CHAT_IMAGES}/` + image[0].image : null ;
                //     } else {
                //         chat.image = null;
                //     }
                // })
                chat.image = chat.image ? `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.CHAT_IMAGES}/` + chat.image : null;
                chat.is_owner = chat.post_account_id ? chat.post_account_id === id : false;
            }));
        // postChats.is_owner = postChats[0].post_account_id ? postChats[0].post_account_id === id : false;

        return res.status(200).json({
            code: 200,
            success: true,
            data: postChats,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Get post chats controller has error: ", error);
        return next(createError(500));
    }
};

export default getPostChatsController;
