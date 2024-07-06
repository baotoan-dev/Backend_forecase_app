import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import * as notificationService from "../../../../services/notification/_service.notification";
import logging from "../../../../utils/logging";
import { INotification } from "../../../../models/notification/interface/notification.interface";
import createNewKeywordNotification from "../../createNotificationContent/keywordNotification/createNewKeywordNotification";
import createNewNotificationForApplication from "../../createNotificationContent/application/createForApplication.test";
import readDefaultPostImageByPostId from "../../../../services/category/service.category.readDefaultPostImageByPostId";
import ImageBucket from "../../../../models/enum/imageBucket.enum";
import readCategoriesOfPost from "../../../../services/postCategory/service.postCategory.readByPostId";

const readAllNotificationsByAccountIdV2Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    // TODO: 
    // READ ALL NOTIFICATIONS BY ACCOUNT ID
    // Notification type 1: Application
    // Notification type 2: Recruiter
    // Notification type 3: Keyword
    // Notification type 5: Follow

    //
    const { id: accountId } = req.user;

    const { page } = req.query;

    const { limit = 20 } = req.query;

    if (page && isNaN(+page)) {
      return next(createHttpError(400, "Page must be a number"));
    }

    // limit must be a number and greater than 0 and less than 21
    if (isNaN(+limit) || +limit < 0 || +limit > 20) {
      return next(createHttpError(400, "Limit must be a number"));
    }

    // Call service
    // Read all notifications by account id from database
    let result =
      await notificationService.readAllNotificationsByAccountIdV2Service(
        accountId,
        +page,
        +limit + 1,
        String(req.query.lang)
      );

    if (!result || result.length === 0) {
      return res.status(200).json({
        code: 200,
        success: true,
        message: "No notifications found",
        data: [],
        is_over: true,
        total_is_not_read: 0
      });
    }
    // const notifications: INotification[] = [];

    // Format data
    // After format, data will be implemented to notifications array
    // Interface INotification

    if (result.length === +limit + 1) {
      result.pop();
    }

    const total = parseInt(result[0].total) || 0;

    const notifications: INotification[] = await Promise.all(
      result.map(async (item, index: number) => {
        let notification: INotification;
        // Notification type 3: Keyword
        if (item.image === null) {
          item.defaultImage = await readDefaultPostImageByPostId(
            item.post_id
          );
        }

        const categories = await readCategoriesOfPost(String(req.query.lang), item.post_id);

        if (+item.type === 3 || +item.type === 5) {
          // image need to use when get notification type 3 by mobile
          // No need image when push notification type 3 to mobile
          notification = createNewKeywordNotification({
            notificationId: item.id,
            postId: item.post_id,
            postTitle: item.post_title,
            type: +item.type,
            companyName: item.company_name,
            isRead: Boolean(+item.is_read),
            createdAt: new Date(item.created_at).getTime(),
            image: item.image
              ? `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.POST_IMAGES}/${item.post_id}/` +
              item.image
              : item.defaultImage.image,
            // districtId: item.district_id,
            districtName: item.district as string,
            provinceId: item.province_id,
            provinceName: item.province as string,
            category: categories,
            jobTypeId: item.job_type_id,
            jobTypeName: item.job_type,
            // companyResourceId: item.company_resource_id,
            companyResourceLogo: item.company_resource_logo,
            lang: req.query.lang.toString(),
          });
        } else {
          // Notification type 1: Application
          // Notification type 2: Recruiter
          notification = createNewNotificationForApplication({
            notificationId: item.id,
            applicationId: item.application_id,
            postId: item.post_id,
            type: +item.type,
            applicationStatus: +item.application_status,
            postTitle: item.post_title,
            companyName: item.company_name,
            name: item.name,
            isRead: Boolean(+item.is_read),
            createdAt: new Date(item.created_at).getTime(),
            lang: req.query.lang.toString(),
          });
        }

        // notifications.push(notification);

        return notification;

      })
    );


    let countTotalIsNotRead = 0;
    notifications.forEach((item) => {
      if (!item.getData().isRead) {
        countTotalIsNotRead++;
      }
    });

    return res.status(200).json({
      code: 200,
      success: true,
      message: "Read all notifications by account id successfully",
      data: {
        total: total,
        notifications: notifications,
        is_over: notifications.length < +limit ? true : false,
        total_is_not_read: countTotalIsNotRead,
        // is_over: true,
      },
    });
  } catch (error) {
    logging.error(error);
    return next(createHttpError(500, "Internal server error"));
  }
};

export default readAllNotificationsByAccountIdV2Controller;
// Path: src/controllers/notification/controller.notification.readAllByAccountId.ts
