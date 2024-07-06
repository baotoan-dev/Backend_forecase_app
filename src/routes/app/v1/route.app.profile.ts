import express from "express";
import profileController from "../../../controllers/profile/_controller.profile";
import verifyAccessTokenMiddleware from "../../../middlewares/middleware.verifyAccessToken";
import { multerUploadImages, multerUploadPdf } from "../../../configs/multer";
import checkIsActiveMiddleware from "../../../middlewares/middleware.checkIsActive";

const router = express.Router();
// READ
router.get("/s", checkIsActiveMiddleware, verifyAccessTokenMiddleware, profileController.readById);

// UPDATE
router.put(
    "/per",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    profileController.updatePersonalInformation
);
router.put(
    "/con",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    profileController.updateContactInformation
);
router.put(
    "/cat",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    profileController.updateCategories
);
router.put(
    "/loc",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    profileController.updateLocations
);

router.put(
    "/edu/c",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    profileController.createEducation
);
router.put(
    "/edu/u",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    profileController.updateEducation
);
router.put(
    "/edu/d",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    profileController.deleteEducation
);

router.put(
    "/exp/c",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    profileController.createExperience
);
router.put(
    "/exp/u",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    profileController.updateExperience
);
router.put(
    "/exp/d",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    profileController.deleteExperience
);

router.put(
    "/cv/c",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    // profileController.createCV
);

router.put(
    "/cv/u",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    // profileController.updateCV
);

router.put(
    "/cv/d",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    // profileController.deleteCV
);

router.put(
    "/avt",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    multerUploadImages,
    profileController.updateAvatar
);

// CV upload
router.post(
    "/cv",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    // multerUploadPdf,
    profileController.createCv
)

router.put(
    "/cv",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    // multerUploadPdf,
    profileController.updateCv
)

router.delete(
    "/cv",
    checkIsActiveMiddleware,  
    verifyAccessTokenMiddleware,
    // multerUploadPdf,
    profileController.deleteCv
)

export default router;
