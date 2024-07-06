import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import * as profileExperienceServices from "../../../services/profileExperience/_service.profileExperience";
import { title } from "process";

const createExperienceOfProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logging.info("Create experience of profile controller start ...");

    // GET PROFILE ID
    const { id } = req.user;
    if (!id) {
      logging.warning("Invalid profile id");
      return next(createError(401));
    }

    // GET BODY DATA
    const bodyData = req.body;
    const titleForCreate = bodyData.title
      ? bodyData.title.toString().trim()
      : null;
    const companyNameForCreate = bodyData.companyName
      ? bodyData.companyName.toString().trim()
      : null;
    const startDateForCreate = +bodyData.startDate;
    const endDateForCreate = +bodyData.endDate;
    const extraInformationForCreate = bodyData.extraInformation
      ? bodyData.extraInformation.toString().trim()
      : null;

    // VALIDATION
    if (
      !titleForCreate ||
      !companyNameForCreate ||
      !Number.isInteger(startDateForCreate) ||
      !Number.isInteger(endDateForCreate) ||
      titleForCreate.length > 50 ||
      companyNameForCreate.length > 50 ||
      extraInformationForCreate.length > 500
    ) {
      logging.warning("Invalid body data");
      return next(createError(400));
    }

    if (
      new Date(startDateForCreate).toString() === "Invalid Date" ||
      new Date(endDateForCreate).toString() === "Invalid Date"
    ) {
      logging.warning("Invalid date value");
      return next(createError(400));
    }

    // HANDLE CREATE
    const isCreateSuccess =
      await profileExperienceServices.createExperienceOfProfile(
        id,
        titleForCreate,
        companyNameForCreate,
        startDateForCreate,
        endDateForCreate,
        extraInformationForCreate
      );
    if (!isCreateSuccess) {
      return next(createError(500));
    }

    // SUCCESS
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Successfully",
    });
  } catch (error) {
    logging.error("Create experience of profile controller has error: ", error);
    return next(createError(500));
  }
};

export default createExperienceOfProfileController;
