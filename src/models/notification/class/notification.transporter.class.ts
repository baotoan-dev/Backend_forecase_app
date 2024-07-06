import * as admin from "firebase-admin";
import { INotificationTransporter } from "../interface/notification.transporter.interface";
// import { Notification } from 'firebase-admin/lib/messaging/messaging-api';
import readFcmTokenService from "../../../services/fcm-token/service.fcm-token.readByAccountId";
import logging from "../../../utils/logging";
import { INotification } from "../interface/notification.interface";
import serviceAccount from "../../../keys/serviceAccountKey.json";
// import { NotificationData } from "./notificationData.class";
import readFcmTokenMultipleAccountIdsService from "../../../services/fcm-token/service.fcm-token.readByMutipleAccountIds";



export class NotificationTransporter implements INotificationTransporter {
    
    public static transporter: admin.app.App | null = null;

    fcmTokens: string[] = [];
    
    constructor() {
        this.initialize();
    }

    // this method is used to get the fcm tokens of the user

    // this method is used to initialize the transporter
    // the transporter is the firebase admin app
    async initialize(): Promise<void> {
        try {
            console.log("initialize");
            if (!NotificationTransporter.transporter) {
                NotificationTransporter.transporter = admin.initializeApp({
                    credential: admin.credential.cert(
                        serviceAccount as admin.ServiceAccount
                    ),
                }) as admin.app.App | null;
            }
        } catch (error) {
            logging.error(error, " NotificationTransporter");
            return;
        }
    }

    // this method is used to send the notification to the user
    // the content is the notification content
    // the data is the data that will be sent to the user
    async send(body: INotification, account_id: string): Promise<any> {
        try {
            if (!NotificationTransporter.transporter) {
                await this.initialize();
            }
    
            if (!(this.fcmTokens[0] !== undefined) || !(this.fcmTokens[0] !== null) || !this.fcmTokens[0]) {
                await this.getFcmTokens(account_id);
            }
            if (this.fcmTokens.length === 0) {
                return;
            }

            // console.log(NotificationTransporter.transporter, " NotificationTransporter");
            // console.log(this.fcmTokens, " NotificationTransporter");
            // console.log(body, " NotificationTransporter");
    
            await NotificationTransporter.transporter.messaging().sendMulticast({
                tokens: this.fcmTokens,
                notification: body.content,
                data: body.getDataForPush(),
                // data: {
                //     "type": body.data.type.toString(),
                //     "type_text": body.data.typeText,
                //     "application_id": body.data.applicationId.toString(),
                //     "post_id": body.data.postId.toString(),
                //     "notification_id": body.data.notificationId.toString(),
                //     "application_status": body.data.applicationStatus.toString(),
                // }
            });

            // "type": data.type.toString(),
            // "type_text": data.type_text,
            // "application_id": data.applicationId.toString(),
            // "post_id": data.postId.toString(),
            // "notification_id": data.notificationId.toString(),
            // "application_status": data.applicationStatus.toString(),
            // console.log("tokens: ", this.fcmTokens);
            // console.log("notification: ", body.content);
            // console.log("data: ", NotificationData.toKeyValue(body.data));
            // console.log("data: ", body.getDataForPush());
            // console.log("data: ", {
            //     "type": body.data.type.toString(),
            //     "type_text": body.data.typeText,
            //     "application_id": body.data.applicationId.toString(),
            //     "post_id": body.data.postId.toString(),
            //     "notification_id": body.data.notificationId.toString(),
            //     "application_status": body.data.applicationStatus.toString(),
            //     // "is_read": body.data.isRead.toString(),
            //     "created_at": body.data.createdAt.toString(),
            // });
            logging.info("Notification sent successfully");
            return;

        }
        catch (error) {
            console.log(error, " NotificationTransporter");
            return;
        }
    }

    async sendMultiple(body: INotification, account_ids: string[]): Promise<any> {
        try {
            if (!NotificationTransporter.transporter) {
                await this.initialize();
            }

            if (!(this.fcmTokens[0] !== undefined) || !(this.fcmTokens[0] !== null) || !this.fcmTokens[0]) {
                await this.getFcmTokensByMultipleAccountIds(account_ids);
            }

            // console.log(NotificationTransporter.transporter, " NotificationTransporter");
            // console.log(this.fcmTokens, " NotificationTransporter");

            if (this.fcmTokens.length === 0) {
                return;
            }

            await NotificationTransporter.transporter.messaging().sendMulticast({
                tokens: this.fcmTokens,
                notification: body.content,
                data: body.getDataForPush(),
            });
            // logging.info("Notification sent successfully");
            // console.log("tokens: ", this.fcmTokens);
            // console.log("notification: ", body.content);
            // console.log("data: ", body.getDataForPush());
            logging.info("Notification sent multiple successfully");
            return;

        }
        catch (error) {
            console.log(error, " NotificationTransporter");
            return;
        }
    }


    // this method is used to get the fcm tokens of the user
    // set the fcm tokens to the fcmTokens property
    async getFcmTokens(account_id: string): Promise<string[]> {
        try {
            if (!account_id) {
                return [];
            }
            const res = await readFcmTokenService(account_id);
            this.fcmTokens = res.map((item: any) => item.token);
            return this.fcmTokens;
        } catch (error) {
            console.log(error, " NotificationTransporter");
            return [];
        }
    }

    async getFcmTokensByMultipleAccountIds(account_ids: string[]): Promise<string[]> {
        try {
            if (!account_ids) {
                return [];
            }
            const res = await readFcmTokenMultipleAccountIdsService(account_ids);
            // console.log(res, " NotificationTransporter");
            this.fcmTokens = res.map((item: any) => item.token);
            return this.fcmTokens;
        } catch (error) {
            console.log(error, " NotificationTransporter");
            return [];
        }
    }

}
    