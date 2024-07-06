import { Notification } from "firebase-admin/lib/messaging/messaging-api";
import { NotificationData } from "../../../../models/notification/class/notificationData.class";
import generateTitle from "./generateTitle";
import generateBody from "./generateBody";
import { KeywordNotification } from "../../../../models/notification/keyword/class/keywordNotification.class";
import logging from "../../../../utils/logging";
import ImageBucket from "../../../../models/enum/imageBucket.enum";
import generateTitleFollow from "./generateTitleFollow";
import generateBodyFollow from "./generateBodyFollow";

const createNewKeywordNotification = ({
    postId,
    type,
    postTitle,
    companyName,
    notificationId,
    isRead,
    createdAt,
    image,
    districtId = null,
    districtName = null,
    provinceId = null,
    provinceName = null,
    category = null,
    jobTypeId = null,
    jobTypeName = null,
    companyResourceId = null,
    companyResourceLogo = null,
    lang = "vi",
}: {
    postId: number;
    type: number;
    postTitle: string;
    companyName: string;
    notificationId: number;
    isRead: boolean;
    createdAt: number;
    image?: string;
    districtId?: number;
    districtName?: string;
    provinceId?: number;
    provinceName?: string;
    category?: any[];
    jobTypeId?: number;
    jobTypeName?: string;
    companyResourceId?: number;
    companyResourceLogo?: string;
    lang?: string;
}): KeywordNotification => {
    // DATA
    try {
        const data: NotificationData = {
            // applicationId,
            notificationId,
            postId,
            postTitle,
            type,
            isRead,
            createdAt,
            image,
            location: {
                district: {
                    id: districtId,
                    name: districtName,
                },
                province: {
                    id: provinceId,
                    name: provinceName,
                },
            },
            category,
            jobType: {
                id: jobTypeId,
                name: jobTypeName,
            },
            companyResource: {
                id: companyResourceId,
                logo: `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.COMPANY_ICON}/${companyResourceLogo}`,
                companyName,

            },
            typeText: type === 3 ? "keyword" : "follow",
        };

        // CONTENT
        const content: Notification = {
            title: generateTitle({ lang }),
            body: generateBody({
                postTitle,
                companyName,
                lang,
            }),
        };
        const content_app = {
            title: generateTitle({ lang }),
            body: generateBody({
                postTitle,
                companyName,
                lang,
            }),
        };

        const contentFollow: Notification = {
            title: generateTitleFollow({ lang }),
            body: generateBodyFollow({
                postTitle,
                companyName,
                lang,
            }),
        }

        const content_app_follow = {
            title: generateTitleFollow({ lang }),
            body: generateBodyFollow({
                postTitle,
                companyName,
                lang,
            }),
        }

        // CREATE NOTIFICATION
        const notification = new KeywordNotification(data, type === 3 ? content : contentFollow, type === 3 ? content_app : content_app_follow);

        return notification;
    } catch (error) {
        logging.error(error);
        return;
    }
};

export default createNewKeywordNotification;
