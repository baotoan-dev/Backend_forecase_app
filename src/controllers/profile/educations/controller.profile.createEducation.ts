import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import * as profileEducationServices from "../../../services/profileEducation/_service.profileEducation";

const createEducationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logging.info("Create education of profile controller start ...");

    // GET PROFILE ID
    const { id } = req.user;
    if (!id) {
      logging.warning("Invalid profile id");
      return next(createError(401));
    }

    // GET DATA
    const bodyData = req.body;
    const companyNameForCreate = bodyData.companyName
      ? bodyData.companyName.toString().trim()
      : null;
    const majorForCreate = bodyData.major
      ? bodyData.major.toString().trim()
      : null;
    const startDateForCreate = +bodyData.startDate;
    const endDateForCreate = +bodyData.endDate;
    const extraInformationForCreate = bodyData.extraInformation
      ? bodyData.extraInformation.toString().trim()
      : null;
    const academicTypeIdForCreate = +bodyData.academicTypeId ? +bodyData.academicTypeId : 8;

    // VALIDATION
    if (
      !companyNameForCreate ||
      !majorForCreate ||
      !Number.isInteger(startDateForCreate) ||
      !Number.isInteger(endDateForCreate) ||
      companyNameForCreate.length > 50 ||
      majorForCreate.length > 50 ||
      extraInformationForCreate.length > 500 || !Number.isInteger(academicTypeIdForCreate)
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
      await profileEducationServices.createEducationOfProfile(
        id,
        companyNameForCreate,
        majorForCreate,
        startDateForCreate,
        endDateForCreate,
        extraInformationForCreate,
        academicTypeIdForCreate,
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
    logging.error("Create education of profile controller has error: ", error);
    return next(createError(500));
  }
};

export default createEducationController;
