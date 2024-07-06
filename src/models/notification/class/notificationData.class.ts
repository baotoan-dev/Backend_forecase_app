import { INotificationData } from "../interface/notification.interface";

export class NotificationData implements INotificationData {
    [key: string]: any;

    constructor(data: INotificationData) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}
