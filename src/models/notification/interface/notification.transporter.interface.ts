
/*
    This interface is used to define the transporter for the notification
    It can be used for push notification to mobile devices
*/

import { INotification } from "./notification.interface";

export interface INotificationTransporter {

    // static transporter: any;

    fcmTokens: string[];

    [key: string]: any;

    initialize(): Promise<void>;

    send(body: INotification, account_id: string): Promise<any>;

    // this method is used to get the fcm tokens of the user
    // set the fcm tokens to the fcmTokens property
    getFcmTokens(account_id: string): Promise<string[]>;
}