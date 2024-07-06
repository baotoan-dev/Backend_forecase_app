import { Notification } from "firebase-admin/lib/messaging/messaging-api";
import { INotification } from "../../interface/notification.interface";
import { NotificationData } from "../../class/notificationData.class";

export class KeywordNotification implements INotification {
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
            "post_id": this.data.postId.toString(),
            "type": "3",
            "type_text": "keyword",
        }
    }

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

    // this method is used to get the notification data
    getDataApp(): any {
        return this.content_app;
    }

    // this method is used to set the notification data
    setDataApp(data: any): void {
        this.content_app = data;
    }

}