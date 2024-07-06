import { OAuth2Client } from "google-auth-library";
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../../utils/logging";
import removeUnnecessaryDots from "../../../helpers/formatData/removeUnnecessaryDotsInEmail";

const signInWithGoogleController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info("Sign in with google controller start ...");
        // GET DATA
        const idToken: string = req.body.idToken
            ? req.body.idToken.toString().trim()
            : "";
        const isIOS: boolean = req.body.isIOS ? req.body.isIOS : false;
        const isWeb: boolean = req.body.isWeb ? req.body.isWeb : false;

        if (!idToken) {
            return next(createError(400, "Invalid id token"));
        }

        if (!(isIOS === true || isIOS === false || isWeb === true || isWeb === false)) {
            return next(createError(400, "Invalid isIOS value"));
        }

        let CLIENT_ID: string = "";
        // INIT CLIENT ID
        if (isIOS) {
            CLIENT_ID = process.env.GOOGLE_CLIENT_ID_IOS;
        } else if (isWeb) {
            CLIENT_ID = process.env.GOOGLE_CLIENT_ID_WEB;
        } else {
            CLIENT_ID = process.env.GOOGLE_CLIENT_ID_FOR_ANDROID;
        }

        // INIT OAUTH2 CLIENT
        const client = new OAuth2Client(CLIENT_ID);

        // GET TICKET
        const ticket = await client.verifyIdToken({
            idToken,
            audience: CLIENT_ID,
        });

        // GET DATA OF GOOGLE USER
        const payload = ticket.getPayload();
        const { sub, name, email } = payload;

        // REMOVE INVALID DOT CHARS FROM EMAIL
        const emailRemovedDots = email ? removeUnnecessaryDots(email) : "";
        
        // GET ACCOUNT BY EMAIL
        if (!email) {
            return next(createError(404, "Invalid email"));
        }


        // SUCCESSFUL
        req.body.email = email;
        req.body.emailRemovedDots = emailRemovedDots;
        req.body.ggId = sub;
        req.body.name = name;

        next();
        

    } catch (error) {
        logging.error("Sign in with google controller has error: ", error);
        return next(createError(500));
    }
};

export default signInWithGoogleController;
