// import createError from "http-errors";
// import { Request, Response, NextFunction } from "express";

// import logging from "../../utils/logging";
// import updatePersonalInformationController from "./controller.profile.updatePersonalInformation";
// import updateContactInformationController from "./controller.profile.updateContactInformation";
// import updateCategoriesController from "./controller.profile.updateCategories";
// import updateLocationsOfProfileController from "./controller.profile.updateLocations";
// import updateEducationsOfProfileController from "./controller.profile.updateEducations";
// import updateExperiencesOfProfileController from "./controller.profile.updateExperiences";
// import updateAvatar from "./controller.profile.updateAvatar";

// const updateProfileController = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         logging.info("Update profile controller start ...");

//         // GET PROFILE ID AND TYPE OF UPDATING
//         const { id } = req.user;
//         if (!id) {
//             logging.warning("Invalid profile id");
//             return next(createError(400));
//         }
//         const type: string = req.body.type
//             ? req.body.type.toString().trim()
//             : "";

//         logging.info("Profile id: ", id);
//         logging.info("Type of updating: ", type);

//         if (!id || !type) {
//             logging.warning("Invalid profile id or type of updating");
//             return next(createError(400));
//         }

//         // SWITCH TYPE
//         switch (type) {
//             // UPDATE PERSONAL INFORMATION
//             case "per":
//                 await updatePersonalInformationController(
//                     req,
//                     res,
//                     next,
//                     id,
//                     req.body
//                 );
//                 break;

//             // UPDATE CONTACT INFORMATION
//             case "con":
//                 await updateContactInformationController(
//                     req,
//                     res,
//                     next,
//                     id,
//                     req.body
//                 );
//                 break;

//             // UPDATE CATEGORIES
//             case "cat":
//                 await updateCategoriesController(req, res, next, id, req.body);
//                 break;

//             // UPDATE LOCATIONS
//             case "loc":
//                 await updateLocationsOfProfileController(
//                     req,
//                     res,
//                     next,
//                     id,
//                     req.body
//                 );
//                 break;

//             // UPDATE EDUCATION INFORMATION
//             case "edu":
//                 await updateEducationsOfProfileController(req, res, next, id);
//                 break;

//             // UPDATE EXPERIENCES INFORMATION
//             case "exp":
//                 await updateExperiencesOfProfileController(req, res, next, id);
//                 break;

//             // UPDATE AVATAR
//             case "avt":
//                 await updateAvatar(req, res, next, id);
//                 break;

//             // INVALID TYPE
//             default:
//                 logging.warning("Incorrect type of updating");
//                 return next(createError(409));
//         }
//     } catch (error) {
//         logging.error("Update profile controller has error: ", error);
//         return next(createError(500));
//     }
// };

// export default updateProfileController;
