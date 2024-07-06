import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

import logging from "../../utils/logging";
import * as themeServices from "../../services/theme/_service.theme";

const updateThemesStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Update themes status controller start ...");

        // GET BODY DATA
        const themes = req.body.themes;
        // console.log(">>> themes: ", themes);
        if (!Array.isArray(themes) || themes.length <= 0) {
            logging.warning("Invalid themes data");
            return next(createError(400));
        }

        // GET ALL CURRENT THEME CATEGORIES IN DB
        const currentThemesInDb = await themeServices.readAllThemes();
        if (!themes) {
            return next(createError(500));
        }

        // GET ALL THEME CATEGORIES WILL BE UPDATED
        const themesWillBeUpdated = themes.filter((theme) => {
            return (
                currentThemesInDb.findIndex(
                    (currentTheme) =>
                        currentTheme.id === theme.id &&
                        currentTheme.status === theme.status
                ) < 0
            );
        });
        // console.log(">>> themesWillBeUpdated: ", themesWillBeUpdated);

        // GET ENABLE THEME IDS
        const enableThemeIdsWillBeUpdated = themesWillBeUpdated
            .filter((theme) => theme.status === 1)
            .map((theme) => theme.id);

        // console.log(
        //     ">>> enableThemeIdsWillBeUpdated: ",
        //     enableThemeIdsWillBeUpdated
        // );

        // GET DISABLE THEME IDS
        const disableThemeIdsWillBeUpdated = themesWillBeUpdated
            .filter((theme) => theme.status === 0)
            .map((theme) => theme.id);

        // console.log(
        //     ">>> disableThemeIdsWillBeUpdated: ",
        //     disableThemeIdsWillBeUpdated
        // );

        // HANDLE UPDATE THEMES STATUS
        if (enableThemeIdsWillBeUpdated.length > 0) {
            const isUpdateSuccess = await themeServices.updateThemesStatus(
                enableThemeIdsWillBeUpdated,
                1
            );
            if (!isUpdateSuccess) {
                return next(createError(500));
            }
        }

        if (disableThemeIdsWillBeUpdated.length > 0) {
            const isUpdateSuccess = await themeServices.updateThemesStatus(
                disableThemeIdsWillBeUpdated,
                0
            );
            if (!isUpdateSuccess) {
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
        logging.error("Update themes status controller has error: ", error);
        return next(createError(500));
    }
};

export default updateThemesStatusController;
