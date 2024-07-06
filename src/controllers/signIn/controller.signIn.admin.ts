import {Request, Response, NextFunction} from 'express';
import createError from 'http-errors';
import signAccessTokenService from '../../services/jwt/service.jwt.signAccessToken';
import signRefreshTokenService from '../../services/jwt/service.jwt.signRefreshToken';
import logging from '../../utils/logging';
import * as accountServices from '../../services/account/_service.account';

const adminSignInController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logging.info('Admin sign in controller start ...');

  const email = req.body.email ? req.body.email.toString().trim() : '';
  const password = req.body.password ? req.body.password : '';

  if (!email) {
    return next(createError(400));
  }

  try {
    // GET ADMIN BY EMAIL
    const accountData = await accountServices.readAccountByEmailService(email);

    // console.log(accountData);

    if (!accountData) {
      return next(createError(404));
    }

    if (accountData.status === 0) {
      logging.error('Account is blocked');
      return next(createError(403));
    }

    if (accountData.role !== 1 && accountData.role !== 2) {
      logging.error('Not admin');
      return next(createError(401));
    }

    if (accountData.id !== password) {
      logging.error('Wrong password');
      return next(createError(401));
    }

    // SIGN ACCESS TOKEN AND REFRESH TOKEN
    const accessToken = await signAccessTokenService({
      id: accountData.id,
      role: accountData.role,
    });
    const refreshToken = await signRefreshTokenService({
      id: accountData.id,
      role: accountData.role,
    });

    res.status(200).json({
      code: 200,
      message: 'Successfully',
      data: {
        // isNew : accountData ? false : true,
        id: accountData.id,
        role: accountData.role,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    return {
      code: error.code,
      message: error.message,
    }
  }
};

export default adminSignInController;
