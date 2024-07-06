import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import * as profileExperienceServices from "../../../services/profileExperience/_service.profileExperience";

const updateExperienceOfProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logging.info("Update experience of profile controller start ...");

    // GET PROFILE ID
    const { id } = req.user;
    if (!id) {
      logging.warning("Invalid profile id");
      return next(createError(401));
    }

    // GET BODY DATA
    const bodyData = req.body;
    const experienceIdForUpdate = bodyData.experienceId
      ? +bodyData.experienceId
      : null;
    const titleForUpdate = bodyData.title
      ? bodyData.title.toString().trim()
      : null;
    const companyNameForUpdate = bodyData.companyName
      ? bodyData.companyName.toString().trim()
      : null;
    const startDateForUpdate = +bodyData.startDate;
    const endDateForUpdate = +bodyData.endDate;
    const extraInformationForUpdate = bodyData.extraInformation
      ? bodyData.extraInformation.toString().trim()
      : null;

    // VALIDATION
    if (
      !Number.isInteger(experienceIdForUpdate) ||
      !companyNameForUpdate ||
      !titleForUpdate ||
      !Number.isInteger(startDateForUpdate) ||
      !Number.isInteger(endDateForUpdate) ||
      titleForUpdate.length > 50 ||
      companyNameForUpdate.length > 50 ||
      extraInformationForUpdate.length > 500
    ) {
      logging.warning("Invalid data");
      return next(createError(400));
    }

    if (
      new Date(startDateForUpdate).toString() === "Invalid Date" ||
      new Date(endDateForUpdate).toString() === "Invalid Date"
    ) {
      logging.warning("Invalid data");
      return next(createError(400));
    }

    if (startDateForUpdate > endDateForUpdate) {
      return next(createError(400, "Invalid date range"));
    }

    // HANDLE UPDATE
    const isUpdateSuccess =
      await profileExperienceServices.updateExperienceOfProfile(
        experienceIdForUpdate,
        titleForUpdate,
        companyNameForUpdate,
        startDateForUpdate,
        endDateForUpdate,
        extraInformationForUpdate
      );
    if (!isUpdateSuccess) {
      return next(createError(500));
    }

    // SUCCESS
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Successfully",
    });
  } catch (error) {
    logging.error("Update experience of profile controller has error: ", error);
    return next(createError(500));
  }
};

export default updateExperienceOfProfileController;
