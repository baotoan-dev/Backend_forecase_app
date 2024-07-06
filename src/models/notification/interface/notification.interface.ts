import { Notification } from "firebase-admin/lib/messaging/messaging-api";
import { NotificationData } from "../class/notificationData.class";

export interface INotification {
    data: NotificationData;
    content: Notification;
    // dataContent: NotificationData;
    [key: string]: any;

    // get data to json
    getDataForPush(): { [key: string]: string };
}


export interface INotificationData {
    [key: string]: any;
}