import { Notification } from "firebase-admin/lib/messaging/messaging-api";
import { NotificationData } from "../../../../models/notification/class/notificationData.class";
import generateTitle from "./generateTitle";
import generateBody from "./generateBody";
import { KeywordNotification } from "../../../../models/notification/keyword/class/keywordNotification.class";
import logging from "../../../../utils/logging";

const createCommunicationCommentNotification = ({
    type,
    notificationId,
    communicationId,
    commentId,
    isRead,
    createdAt,
    lang = "vi",
}: {
    type: number;
    notificationId: number;
    communicationId: number;
    commentId: number;
    isRead: boolean;
    createdAt: number;
    lang?: string;
}): KeywordNotification => {
    // DATA
    try {
        const data: NotificationData = {
            notificationId,
            type,
            communicationId,
            commentId,
            isRead,
            createdAt,
            typeText: "communicationComment",
        };

        // CONTENT
        const content: Notification = {
            title: generateTitle({ lang }),
            body: generateBody({ lang }),
        };
        const content_app = {
            title: generateTitle({ lang }),
            body: generateBody({ lang }),
        };

        // CREATE NOTIFICATION
        const notification = new KeywordNotification(data, content, content_app);

        return notification;
    } catch (error) {
        logging.error(error);
        return;
    }
};

export default createCommunicationCommentNotification;
