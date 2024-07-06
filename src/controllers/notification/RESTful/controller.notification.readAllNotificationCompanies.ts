import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import * as notificationService from "../../../services/notification/_service.notification";
import logging from "../../../utils/logging";


const readNotificationCompaniesController = async (
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

    //
    const { id: accountId } = req.user;

    const { page = 0 } = req.query;

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
      await notificationService.readAllNotificationCompaniesService(
        +page,
        +limit
      );

    console.log('result', result);

    if (!result) {
        return next(createHttpError(404, "Notification not found"));
    }

    // Return result
    return res.status(200).json({
        status: 200,
        message: "Success",
        data: result,
    })

  } catch (error) {
    logging.error(error);
    return next(createHttpError(500, "Internal server error"));
  }
};

export default readNotificationCompaniesController;
// Path: src/controllers/notification/controller.notification.readAllByAccountId.ts
