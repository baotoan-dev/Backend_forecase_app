import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import logging from "../../utils/logging";
import * as accountServices from "../../services/account/_service.account";
import * as profileServices from "../../services/profile/_service.profile";
import * as brypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import generateWelcomeMail from "../../html/mail/generateWelcomeMail";
import { sendEmailToUser } from "../../configs/transport/transport";

const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logging.info("Candidate sign in controller start ...");

  const email = req.body.email ? req.body.email.trim() : "";
  const password = req.body.password ? req.body.password : "";
  const name = req.body.name ? req.body.name : "";

  if (!email) {
    return {
      code: 400,
      message: "Email is required",
    };
  }

  try {
    // check otp

    // GET ADMIN BY EMAIL
    const accountData = await accountServices.readAccountByEmailService(email);

    if (accountData) {
      res.json({
        code: 400,
        message: "Email existed",
      });
      return;
    }

    let accountId = uuidv4();

    // brypt password
    const salt = await brypt.genSalt(10);
    const passwordBcrypy = await brypt.hash(password, salt);

    // CREATE ACCOUNT
    const newAccount = await accountServices.createAccountWithEmailService(
      accountId,
      email,
      null,
      passwordBcrypy,
      0
    );

    if (!newAccount) {
        res.json({
            code: 500,
            message: "Internal server error",
        });
        return;
    }

    // CREATE PROFILE
    const newProfile = await profileServices.createProfileWithAccountIdService(
      accountId,
      "",
      name
    );

    if (!newProfile) {
      return {
        code: 500,
        message: "Internal server error",
      }
    }

    sendEmailToUser({
      to: email,
      subject: "Chào mừng bạn đến với Forecase",
      html: generateWelcomeMail(email),
    });

    res.json({
      code: 200,
      message: "Successfully",
      data: {
        accountId: accountId,
      },
    });
  } catch (error) {
    logging.error("Candidate sign in controller start ...", error);
    return {
      code: 500,
      message: "Internal server error",
    }
  }
};

export default signUpController;
