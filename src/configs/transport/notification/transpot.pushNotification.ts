import * as admin from "firebase-admin";
import readFcmTokenService from "../../../services/fcm-token/service.fcm-token.readByAccountId";
import serviceAccount from "../../../keys/serviceAccountKey.json";
import logging from "../../../utils/logging";

const initializeApp = () => {
    return admin.initializeApp({
        credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount
            ),
        }) as admin.app.App | null;
    };
let app = initializeApp();