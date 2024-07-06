import jwt from 'jsonwebtoken';
import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

import logging from "../../utils/logging";
import * as themeServices from "../../services/theme/_service.theme";
import ImageBucket from "../../models/enum/imageBucket.enum";
import readAllByProfileId from '../../services/profileLocation/service.profileLocation.readAllByProfileId';
import { getRandom } from '../../utils/shuffleArray';

const readEnabledThemesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Read enabled themes controller start ...");

        let account_id: string = null;
        let provinces_locations: string[] = [];
        let themes = null;
        if (req.headers.authorization) {
            const headerAuthorization = req.headers.authorization;
            // GET ACCESS TOKEN
            const accessToken = headerAuthorization.split("Bearer")[1]
                ? headerAuthorization.split("Bearer")[1].toString().trim()
                : null;

            if (!accessToken) {
                logging.warning("Invalid access token");
                return next(createError(401));
            }

            // VERIFY ACCESS TOKEN
            jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET,
                async function (err, payload: { id: string, role: number }) {
                    if (err) {
                        // EXPIRED ERROR
                        if (err.name === "TokenExpiredError") {
                            logging.error("Token expired");
                            return next(createError(403));
                        }

                        // OTHER ERROR
                        logging.error(err.message);
                        return next(createError(401));
                    }

                    // VERIFY SUCCESS
                    account_id = payload.id;
                    let profiles_locations = await readAllByProfileId(req.query.lang.toString(), account_id);
                    provinces_locations = profiles_locations.map((location) => location.province_id);
                    themes = await themeServices.readEnabledThemes(provinces_locations);

                    // GET THEMES
                    if (!themes) {
                        return next(createError(400, "No themes found"));
                    }

                    if (profiles_locations.length === 0) {
                        // Shuffle themes and get 10 themes
                        themes = getRandom(themes, 10);
                    }

                    themes.forEach((theme) => {
                        theme.image = `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.THEME_IMAGES}/` + theme.image;
                    });

                    // SUCCESS
                    return res.status(200).json({
                        code: 200,
                        success: true,
                        data: themes.map((theme) => ({
                            ...theme,
                            number_of_posts: Number(theme.number_of_posts),
                        })),
                        message: "Successfully",
                    });
                }
            );
        } else {
            themes = await themeServices.readEnabledThemes();

            
            // GET THEMES
            if (!themes) {
                return next(createError(400, "No themes found"));
            }

            // Shuffle themes and get 10 themes
            themes = getRandom(themes, 10);

            themes.forEach((theme) => {
                theme.image = `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.THEME_IMAGES}/` + theme.image;
            });

            // SUCCESS
            return res.status(200).json({
                code: 200,
                success: true,
                data: themes.map((theme) => ({
                    ...theme,
                    number_of_posts: Number(theme.number_of_posts),
                })),
                message: "Successfully",
            });
        }
    } catch (error) {
        logging.error("Read enabled themes controller has error: ", error);
        return next(createError(500));
    }
};

export default readEnabledThemesController;
