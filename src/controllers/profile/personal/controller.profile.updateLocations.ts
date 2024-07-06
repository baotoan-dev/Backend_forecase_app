import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import * as profileLocationService from "../../../services/profileLocation/_service.profileLocation";

const updateLocationsOfProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Update categories of profile controller start ...");

        // GET PROFILE ID
        const { id } = req.user;
        if (!id) {
            logging.warning("Invalid profile id");
            return next(createError(401));
        }

        // GET BODY DATA
        const locationIds = req.body.locationIds ? req.body.locationIds : null;
        // console.log(">>> locationIds: ", locationIds);

        // VALIDATION
        if (!locationIds || typeof locationIds !== "object") {
            logging.warning("Invalid data");
            return next(createError(400));
        }

        if (locationIds.length > 10) {
            logging.warning("Invalid data");
            return next(createError(400, "You can only select 10 locations"));
        }

        // HANDLE
        const locationIdsWillBeDeleted = [];
        const locationIdsWillBeCreated = [...locationIds];
        const currentLocationsOfProfile =
            await profileLocationService.readCurrentLocationsById(id);

        // The result is an array of object with each item has format: [{category_id: 1, ...}]
        // So, we need to map the array to get category_id only
        const currentLocationIds = currentLocationsOfProfile.map(
            (obj) => obj["district_id"]
        );

        currentLocationIds.forEach((locationId: string) => {
            // console.log("item: ", locationId);
            if (locationIds.includes(locationId)) {
                // REMOVE ITEM FROM LOCATION IDS WILL BE CREATED
                locationIdsWillBeCreated.splice(
                    locationIdsWillBeCreated.indexOf(locationId),
                    1
                );
            } else {
                // ADD TO LOCATION IDS WILL BE DELETED
                locationIdsWillBeDeleted.push(locationId);
            }
        });

        // HANDLE CREATE
        // console.log(">>> locationIdsWillBeCreated: ", locationIdsWillBeCreated);
        if (locationIdsWillBeCreated.length > 0) {
            const isCreateSuccess =
                await profileLocationService.createLocationsOfProfile(
                    id,
                    locationIdsWillBeCreated
                );

            if (isCreateSuccess === "ER_NO_REFERENCED_ROW_2") {
                return next(createError(400, "Invalid location id"));
            }

            if (!isCreateSuccess) {
                return next(createError(500));
            }
        }

        // HANDLE DELETE
        // console.log(">>> locationIdsWillBeDeleted: ", locationIdsWillBeDeleted);
        if (locationIdsWillBeDeleted.length > 0) {
            const isDeleteSuccess =
                await profileLocationService.deleteLocationsOfProfile(
                    id,
                    locationIdsWillBeDeleted
                );
            if (!isDeleteSuccess) {
                return next(createError(500));
            }
        }

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        logging.error(
            "Update categories of profile controller has error: ",
            error
        );
        return next(createError(500));
    }
};

export default updateLocationsOfProfileController;
