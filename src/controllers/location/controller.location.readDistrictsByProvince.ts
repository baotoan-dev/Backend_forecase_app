import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

import logging from "../../utils/logging";
import * as locationServices from "../../services/location/_service.location";
import { sortDistrict } from "./handleResponse/sortDistrict";

const readDistrictByProvince = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {


    try {
        logging.info("Read districts by province controller start ...");

        // GET PROVINCE ID
        const provinceId = +req.query.pid;

        var { lang = "" } = req.query;

        if (!provinceId || !Number.isInteger(provinceId)) {
            logging.warning("Invalid province id");
            return next(createError(400));
        }

        if (lang.toString().trim() != "") {
            if ((lang.toString().trim() != 'vi' && lang.toString().trim() != 'en' && lang.toString().trim() != 'ko')) {
                logging.warning("Invalid language");
                return next(createError(400));
            }
        } else {
            lang = "vi"
        }

        // GET DATA
        const districts = await locationServices.readDistrictsByProvince(
            provinceId,
            lang.toString()
        );
        if (!districts) {
            return next(createError(500));
        }

        // Sort        
        const data = sortDistrict(districts).map(district => {
            return {
                id: district.id,
                full_name: district.full_name,
            }
        })

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: data,
            message: "Successfully",
        });
    } catch (error) {
        logging.error(
            "Read districts by province controller has error: ",
            error
        );
        return next(createError(500));
    }
};
export default readDistrictByProvince;
