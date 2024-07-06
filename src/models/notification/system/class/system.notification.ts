import { Notification } from "firebase-admin/lib/messaging/messaging-api";
import { INotification } from "../../interface/notification.interface";
import { NotificationData } from "../../class/notificationData.class";


export class SystemNotification implements INotification {
    data: NotificationData;
    content: Notification;
    content_app: any;

    constructor(data: NotificationData, content: Notification, content_app: any) {
        this.data = data;
        this.content = content;
        this.content_app = content_app;
    }

    getDataForPush(): { [key: string]: string; } {
        return {
            "type": String(this.data.type),
            "type_text": String(this.data.typeText),
            "application_id": String(this.data.applicationId),
            "post_id": String(this.data.postId),
            "notification_id": String(this.data.notificationId),
            "application_status": String(this.data.applicationStatus),
        }
    }

    // "type": data.type.toString(),
        // "type_text": data.type_text,
        // "application_id": data.applicationId.toString(),
        // "post_id": data.postId.toString(),
        // "notification_id": data.notificationId.toString(),
        // "application_status": data.applicationStatus.toString(),

    // this method is used to get the notification data
    getData(): NotificationData {
        return this.data;
    }

    // this method is used to get the notification content
    getContent(): Notification {
        return this.content;
    }

    // this method is used to set the notification data
    setData(data: NotificationData): void {
        this.data = data;
    }

    // this method is used to set the notification content
    setContent(content: Notification): void {
        this.content = content;
    }

    // this method is used to get the notification content
    getContentApp(): any {
        return this.content_app;
    }

    // this method is used to set the notification data
    setDataApp(data: NotificationData): void {
        this.data = data;
    }
}