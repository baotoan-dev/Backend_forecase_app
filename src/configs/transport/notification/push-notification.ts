// import * as admin from "firebase-admin";
import readFcmTokenService from "../../../services/fcm-token/service.fcm-token.readByAccountId";
// import serviceAccount from "../../../keys/serviceAccountKey.json";
// import logging from "../../../utils/logging";
import { NotificationTransporter } from "../../../models/notification/class/notification.transporter.class";

interface TokenResult {
    token: string;
    account_id: string;
    created_at: string;
}

interface NotificationData {
    type: number;
    type_text: string;
    applicationId: number | null;
    postId: number | null;
    notificationId: number | null;
    applicationStatus: number | null;
}

// const initializeApp = () => {
//     return admin.initializeApp({
//         credential: admin.credential.cert(
//             serviceAccount as admin.ServiceAccount
//             ),
//         }) as admin.app.App | null;
//     };
// // let app = initializeApp();
// let app: any;
    
    
const pushNotification = async (
    accountId: string,
    title: string,
    body: string,
    // imageUrl: string,
    data: NotificationData,
) => {

    const res = await readFcmTokenService(accountId);


    // if (!app) {
    //     app = initializeApp();
    // }

    if (!(res[0] !== undefined) || !(res[0] !== null) || !res[0]) {
        return;
    }

    const tokens = res.map((item: TokenResult) => item.token);

    const transporter = new NotificationTransporter();

    await transporter.initialize(); // initialize the transporter

    

    await NotificationTransporter.transporter.messaging().sendMulticast({
        tokens: tokens,
        notification: {
            title: title || "",
            body: body || "",
        },
        data: {
            "type": data.type.toString(),
            "type_text": data.type_text,
            "application_id": data.applicationId.toString(),
            "post_id": data.postId.toString(),
            "notification_id": data.notificationId.toString(),
            "application_status": data.applicationStatus.toString(),
        }
    }).then(() => {
        console.log("Firebase-notification: Successfully sent message.",);
    }).catch((error) => {
        console.log("Firebase-notification: Error sending message.", error);
    });
    return;

}

export default pushNotification;