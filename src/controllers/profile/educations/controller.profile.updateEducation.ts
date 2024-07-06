import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import * as profileEducationServices from "../../../services/profileEducation/_service.profileEducation";

const updateEducationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logging.info("Update education of profile controller start ...");

    // GET PROFILE ID
    const { id } = req.user;
    if (!id) {
      logging.warning("Invalid profile id");
      return next(createError(401));
    }

    // GET DATA
    const bodyData = req.body;
    const educationIdForUpdate = bodyData.educationId
      ? +bodyData.educationId
      : null;
    const companyNameForUpdate = bodyData.companyName
      ? bodyData.companyName.toString().trim()
      : null;
    const majorForUpdate = bodyData.major
      ? bodyData.major.toString().trim()
      : null;
    const startDateForUpdate = +bodyData.startDate;
    const endDateForUpdate = +bodyData.endDate;
    const extraInformationForUpdate = bodyData.extraInformation
      ? bodyData.extraInformation.toString().trim()
      : null;
    const academicTypeIdForUpdate = +bodyData.academicTypeId ? +bodyData.academicTypeId : null;

    // VALIDATION
    if (
      !Number.isInteger(educationIdForUpdate) ||
      !companyNameForUpdate ||
      !majorForUpdate ||
      !Number.isInteger(startDateForUpdate) ||
      !Number.isInteger(endDateForUpdate) ||
      companyNameForUpdate.length > 50 ||
      majorForUpdate.length > 50 ||
      extraInformationForUpdate.length > 500
    ) {
      logging.warning("Invalid data");
      return next(createError(400));
    }

    if (
      new Date(startDateForUpdate).toString() === "Invalid Date" ||
      new Date(endDateForUpdate).toString() === "Invalid Date"
    ) {
      logging.warning("Invalid date value");
      return next(createError(400));
    }

    if (startDateForUpdate > endDateForUpdate) {
      return next(createError(400, "Invalid date range"));
    }

    // HANDLE UPDATE
    const isUpdateSuccess =
      await profileEducationServices.updateEducationOfProfile(
        educationIdForUpdate,
        companyNameForUpdate,
        majorForUpdate,
        startDateForUpdate,
        endDateForUpdate,
        extraInformationForUpdate,
        academicTypeIdForUpdate
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
    logging.error("Update education of profile controller has error: ", error);
    return next(createError(500));
  }
};

export default updateEducationController;
