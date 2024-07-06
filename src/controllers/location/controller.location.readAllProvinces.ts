import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

import logging from '../../utils/logging';
import * as locationServices from '../../services/location/_service.location';

const readAllProvinces = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search } = req.query;
    logging.info('Read all provinces controller start ...');
    const provinces = await locationServices.readAllProvinces(search ? search.toString() : null);
    if (!provinces) {
      return next(createError(500));
    }

    // Sort
    // Sort
    provinces.forEach((province, index) => {
      // Ho Chi Minh
      if (province.id === '79') {
        const firstProvince = provinces[0];
        provinces[0] = province;
        provinces[index] = firstProvince;
      }
      // Ha Noi
      if (province.id === '01') {
        const secondProvince = provinces[1];
        provinces[1] = province;
        provinces[index] = secondProvince;
      }
      // Da Nang
      if (province.id === '48') {
        const thirdProvince = provinces[2];
        provinces[2] = province;
        provinces[index] = thirdProvince;
      }
    });
    const wantedProvinces = provinces
      .slice(0, 3)
      .concat(provinces.slice(3).sort((a, b) => a.name.localeCompare(b.name)));

    // SUCCESS
    return res.status(200).json({
      code: 200,
      success: true,
      data: wantedProvinces,
      message: 'Successfully',
    });
  } catch (error) {
    logging.error('Read all provinces controller has error: ', error);
    return next(createError(500));
  }
};

export default readAllProvinces;
