import { Notification } from "firebase-admin/lib/messaging/messaging-api";
import { NotificationData } from "../../../../models/notification/class/notificationData.class";
import { SystemNotification } from "../../../../models/notification/system/class/system.notification";
import generateTitle from "./generateTitle";
import generateBody from "./generateBody";
import logging from "../../../../utils/logging";
import generateBodyHTML from "./generateBodyHTML";

const createNewNotificationForApplication = (
    {
        applicationId,
        postId,
        type,
        // type_text,
        applicationStatus,
        postTitle,
        companyName,
        name,
        notificationId,
        isRead,
        createdAt = new Date().getTime(),
        lang = "vi"
    }: {
        applicationId: number;
        postId: number;
        type: number;
        applicationStatus: number;
        postTitle: string;
        companyName: string;
        name: string;
        notificationId: number;
        isRead?: boolean;
        createdAt?: number;
        lang?: string;
    }
): SystemNotification => {
    // DATA

    // console.log("createNewNotificationForApplication");

    try {

        const data: NotificationData = {
            notificationId,
            applicationId,
            postId,
            type,
            applicationStatus,
            isRead,
            createdAt,
            typeText: type === 0 ? "applicator" : "recruiter"
        }

        // console.log(data, "data");

        // const data: NotificationData = {
        //     type: type.toString(),
        //     type_text: type === 0 ? "applicator" : "recruiter",
        //     application_id: applicationId.toString(),
        //     post_id: postId.toString(),
        //     notification_id: notificationId.toString(),
        //     is_read: isRead ? "1" : "0",
        //     application_status: applicationStatus.toString(),
        //     created_at: createdAt.toString()
        // }
    
        // CONTENT
        const content: Notification = {
            title: generateTitle({
                type,
                applicationStatus,
                lang
            }),
            body: generateBody({
                type,
                applicationStatus,
                postTitle,
                companyName,
                name,
                lang
            }),
        }
    
        const content_app = {
            title: generateTitle({
                type,
                applicationStatus,
                lang
            }),
            body: generateBodyHTML({
                type,
                applicationStatus,
                postTitle,
                companyName,
                name,
                lang
            }),
        }
    
    
        // CREATE NOTIFICATION
        const notification = new SystemNotification(data, content, content_app);

        return notification;
    } catch (error) {
        logging.error(error);
        return;
    }

}

export default createNewNotificationForApplication;