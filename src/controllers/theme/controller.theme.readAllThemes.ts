import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

import logging from "../../utils/logging";
import * as themeServices from "../../services/theme/_service.theme";
import * as themeLocationServices from "../../services/themeLocation/_service.themeLocation";
import ImageBucket from "../../models/enum/imageBucket.enum";

const readAllThemesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Read all themes controller start ...");

        // GET THEMES
        const themes = await themeServices.readAllThemes();
        if (!themes) {
            return next(createError(500));
        }

        themes.forEach((theme) => {
            theme.image = `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.THEME_IMAGES}/` + theme.image;
        });

        // GET THEME LOCATIONS
        await Promise.all(
            themes.map(async (theme, index) => {
                const themeLocations =
                    await themeLocationServices.getThemeLocations(theme.id);
                if (!themeLocations) {
                    return next(createError(500));
                }
                themes[index].locations = themeLocations;
            })
        );

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: themes,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("Read all themes controller has error: ", error);
        return next(createError(500));
    }
};

export default readAllThemesController;
