import createKeywordNotification from "./controller.notification.keyword.create";
import deleteKeywordNotificationController from "./controller.notification.keyword.delete";
import readKeywordNotification from "./controller.notification.keyword.read";
import updateKeywordNotificationStatusController from "./controller.notification.keyword.update";

const keywordNotificationController = {
    create: createKeywordNotification,
    updateStatus: updateKeywordNotificationStatusController,
    delete: deleteKeywordNotificationController,
    read: readKeywordNotification
}

export default keywordNotificationController;