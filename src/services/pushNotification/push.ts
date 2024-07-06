import { NotificationTransporter } from "../../models/notification/class/notification.transporter.class";
import { INotification } from "../../models/notification/interface/notification.interface";

const pushNotification = async (
    account_ids: string | string[], body: INotification
) => {
    try {
        const pusher = new NotificationTransporter();
        await pusher.initialize();

        console.log(account_ids, " account_ids");

        if (typeof account_ids === "string") {
            await pusher.send(body, account_ids);
            // console.log(account_ids, " account_ids");
            return;
        } else {
            // console.log(account_ids, " account_ids");
            await pusher.sendMultiple(body, account_ids);
            return;
        }
        
    }
    catch (error) {
        console.log(error, " NotificationTransporter");
        return;
    }
    
}

export default pushNotification;

