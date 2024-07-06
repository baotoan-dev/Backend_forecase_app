import { NextFunction, Request, Response } from "express";
import { multerUploadPdf } from "../../../configs/multer";
import createHttpError from "http-errors";
import ProfilesBucket from "../../../models/enum/profileBucket.enum";
import updateCV from "../../../services/profile/service.profile.updateCv";
import logging from "../../../utils/logging";
import readProfileByIdService from "../../../services/profile/service.profile.readById";
import uploadCVToCloudinaryService from "../../../services/cloudinary/service.cloudinary.uploadCv";


const createCVProfileController = async (req: Request, res: Response, next: NextFunction) => {
    logging.info("Create CV profile controller start ...");
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

            if (isCVExist.cv_url) {
                return next(createHttpError(400, "CV already exists"));
            }

            // upload cv to aws s3
            const isUploadCVSuccess = await uploadCVToCloudinaryService(file, file.originalname, ProfilesBucket.CV_BUCKET, userId);

            if (!isUploadCVSuccess) {
                return next(createHttpError(500, "Upload CV to cloudinary failed"));
            }

            // if success, update cv url to db
            const urlLenght = ((isUploadCVSuccess as any).url.split('/')).length;

            const url =  ((isUploadCVSuccess as any).url.split('/'))[urlLenght - 1]

            const createdCV = await updateCV(
                userId,
                url as any,
            );

            if (!createdCV) {
                return next(createHttpError(500, "Create CV failed"));
            }

            return res.status(201).json(
                {
                    message: "Created CV successfully",
                    data: {
                        cv: `${process.env.AWS_BUCKET_PREFIX_URL}/${ProfilesBucket.CV_BUCKET}/${userId}/${url}`,
                    },
                    status: 201,
                    success: true,
                }

            );
        }
        catch (err) {
            return next(err);
        }

    });
}

export default createCVProfileController;