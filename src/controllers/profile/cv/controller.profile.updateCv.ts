import { NextFunction, Request, Response } from "express";
import { multerUploadPdf } from "../../../configs/multer";
import createHttpError from "http-errors";
import ProfilesBucket from "../../../models/enum/profileBucket.enum";
import updateCV from "../../../services/profile/service.profile.updateCv";
import logging from "../../../utils/logging";
import readProfileByIdService from "../../../services/profile/service.profile.readById";
import deleteCv from "../../../services/aws/service.aws.deleteCv";
import uploadCVToCloudinaryService from "../../../services/cloudinary/service.cloudinary.uploadCv";


const updateCVProfileController = async (req: Request, res: Response, next: NextFunction) => {
    logging.info("Update CV profile controller start ...");
    multerUploadPdf(req, res, async (err) => {
        if (err) {
            console.log(err);
            return next(createHttpError(400, err.message));
        }

        const { file } = req;
        const { id: userId } = req.user;

        if (!file) {
            return next(createHttpError(400, "CV is required"));
        }

        // const cvUrl = file.path;

        try {
            const isCVExist = await readProfileByIdService("vi", userId);

            if (!isCVExist.cv_url) {
                return next(createHttpError(400, "CV does not exist. Please create CV first"));
            }
            
            deleteCv(userId, isCVExist.cv_url)

            // upload cv to aws s3
            const isUploadCVSuccess = await uploadCVToCloudinaryService(file, file.originalname, ProfilesBucket.CV_BUCKET, userId);
            if (!isUploadCVSuccess) {
                return next(createHttpError(500, "Upload CV to AWS S3 failed"));
            }

            // if success, update cv url to db
            const urlLenght = ((isUploadCVSuccess as any).url.split('/')).length;

            const url =  ((isUploadCVSuccess as any).url.split('/'))[urlLenght - 1]
            
            const updatedCV = await updateCV(
                userId,
                url
            );

            // delete old cv in aws s3

            if (!updatedCV) {
                return next(createHttpError(500, "Update CV failed"));
            }

            return res.status(200).json(
                {
                    message: "Updated CV successfully",
                    data: {
                        cv: `${process.env.AWS_BUCKET_PREFIX_URL}/${ProfilesBucket.CV_BUCKET}/${userId}/${url}`,
                    },
                    status: 200,
                    success: true,
                }

            );
        }
        catch (err) {
            return next(err);
        }

    });
}

export default updateCVProfileController;