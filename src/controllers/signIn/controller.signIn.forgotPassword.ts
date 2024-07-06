import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import logging from "../../utils/logging";
import * as accountServices from "../../services/account/_service.account";
import { sendEmailToUser } from "../../configs/transport/transport";
import generateOTPMail from "../../html/mail/generateOTPMail";
import redisClient from "../../configs/redis";

const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logging.info("Forgot password controller start ...");

  const email = req.body.email ? req.body.email.trim() : "";

  if (!email) {
    return next(createError(400));
  }

  try {
    const accountData = await accountServices.readAccountByEmailService(email);

    if (!accountData) {
      return next(createError(404));
    }

    // 4 chữ số
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await redisClient.set(email, otp);

    sendEmailToUser({
      to: email,
      subject: "Forgot password",
      html: generateOTPMail(otp, email),
    });

    res.status(200).json({
      code: 200,
      message: "Successfully",
      data: {},
    });
  } catch (error) {
    logging.error("Forgot password controller has error: ", error);
    next(createError(500));
  }
};

export default forgotPasswordController;
