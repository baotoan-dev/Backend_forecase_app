import { Request,Response, NextFunction } from "express";
import logging from "../../utils/logging";
import createHttpError from "http-errors";
import deleteAccountByIdService from "../../services/account/service.account.deleteById";

const deleteAccountControllerById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;
    try {

        const { id: idParam } = req.params;

        if (!id) {
            return next(createHttpError(400, "Bad request"));
        }

        if (id !== idParam) {
            return next(createHttpError(400, "Bad request. Can not delete account"));
        }

        const isSuccess = await deleteAccountByIdService(id);

        if (!isSuccess) {
            return next(createHttpError(400, "Bad request. Can not delete account"));
        }

        return res.status(200).json({
            code: 200,
            message: "Delete account by id successfully",
            success: true,
            data: null,
        });


    } catch (error) {
        logging.error("Delete account by id error: ", error);
        return res.status(500).json({
            code: 500,
            message: "Delete account by id error",
            success: false,
            data: null,
        });

    }

}

export default deleteAccountControllerById;