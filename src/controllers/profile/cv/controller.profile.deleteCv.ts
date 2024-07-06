import { NextFunction, Request, Response } from "express";
import { multerUploadPdf } from "../../../configs/multer";
import createHttpError from "http-errors";
import uploadCVToS3Service from "../../../services/aws/service.aws.uploadCv";
import ProfilesBucket from "../../../models/enum/profileBucket.enum";
import updateCV from "../../../services/profile/service.profile.updateCv";
import logging from "../../../utils/logging";
import readProfileByIdService from "../../../services/profile/service.profile.readById";
import deleteCv from "../../../services/aws/service.aws.deleteCv";


const deleteCVProfileController = async (req: Request, res: Response, next: NextFunction) => {
    logging.info("Delete CV profile controller start ...");

        const { id: userId } = req.user;

        try {
            const isCVExist = await readProfileByIdService("vi", userId);

            if (!isCVExist.cv_url) {
                return next(createHttpError(400, "CV does not exist"));
            }

            const createdCV = await updateCV(
                userId,
                ""
            );

            deleteCv(userId, isCVExist.cv_url)

            if (!createdCV) {
                return next(createHttpError(500, "Delete CV failed"));
            }

            return res.status(200).json(
                {
                    message: "Deleted CV successfully",
                    data: {
                        cv: null,
                    },
                    status: 200,
                    success: true,
                }

            );
        }
        catch (err) {
            return next(err);
        }
}

export default deleteCVProfileController;   