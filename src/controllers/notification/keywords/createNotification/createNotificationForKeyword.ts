import { NotificationData } from "../../../../models/notification/class/notificationData.class";
import { FollowNotification } from "../../../../models/notification/keyword/class/followNotification.class";
import { KeywordNotification } from "../../../../models/notification/keyword/class/keywordNotification.class";
import readFollowByPostDetailService from "../../../../services/notification/follow/service.notification.follow.getFollowByPost";
import readKeywordByPostDetailService from "../../../../services/notification/keyword/service.notification.keyword.getKeywordByPost";
import createNotificationForKeywordService from "../../../../services/notification/service.notification.createNotificationForKeyword";
import pushNotification from "../../../../services/pushNotification/push";

const createNotificationKeywordForUsers = async (
    {
        postTitle,
        postId,
        wardId,
        categoryId,
        accountId,
    }
) => {
    // this function will be called when a new job is created
    // if the job title contains a keyword, 
    // districtId of the job is the same as the districtId of the keyword
    // categoryId of the job is the same as the categoryId of the keyword
    // then create a notification for all users who have subscribed to that keyword
    // the notification will be sent to the user's mobile device

    // get all keywords
    // get all users who have subscribed to that keyword
    // create a notification for each user
    // send the notification to the user's mobile device

    try {
        // console.log("createNotificationKeywordForUsers");
        // console.log(postTitle, " postTitle");
        // console.log(postId, " postId");
        // console.log(wardId, " wardId");
        // console.log(categoryId, " categoryId");

        const accountIds: string[] | string = [];

        const accountIdsFollowed: string[] = [];

        const listAccountIds = await readKeywordByPostDetailService(postTitle, wardId, categoryId);

        const listAccountIdsFollow = await readFollowByPostDetailService(accountId);

        console.log('listAccIdsFollow', listAccountIdsFollow);

        // console.log(listAccountIds, " listAccountIds");

        listAccountIds.forEach((item: any) => {
            accountIds.push(item.account_id);
        });

        listAccountIdsFollow.forEach((item: any) => {
            accountIdsFollowed.push(item.account_id);
        });

        // console.log(accountIds, " accountIds");

        // create a notification for each user
        // send the notification to the user's mobile device

        const data: NotificationData = new NotificationData({
            postId: postId,
        })

        const content = {
            title: "Bạn có một việc làm mới",
            body: postTitle,
        }

        const content_app = {
            title: "Bạn có một việc làm mới",
            body: postTitle,
        }

        const contentFollow = {
            title: "Công ty bạn theo dõi có việc làm mới",
            body: postTitle,
        }

        const content_app_follow = {
            title: "Công ty bạn theo dõi có việc làm mới",
            body: postTitle,
        }

        const body: KeywordNotification = new KeywordNotification(data, content, content_app);

        const bodyFollow: FollowNotification = new FollowNotification(data, contentFollow, content_app_follow);

        if (accountIds.length > 0) {
            const isCreated = await createNotificationForKeywordService(accountIds, postId, 3);
            if (!isCreated) {
                throw new Error("createNotificationForKeywordService failed");
            }
            pushNotification(
                accountIds,
                body
            )
        } else {
            console.log("No user has subscribed to this keyword");
        }

        if (accountIdsFollowed.length > 0) {
            const isCreated = await createNotificationForKeywordService(accountIdsFollowed, postId, 5);

            if (!isCreated) {
                throw new Error("createNotificationForFollowService failed");
            }

            pushNotification(
                accountIdsFollowed,
                bodyFollow
            )
        }

    } catch (error) {
        console.log(error, " createNotificationKeywordForUsers");
    }

}

export default createNotificationKeywordForUsers;