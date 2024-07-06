import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

import logging from '../../utils/logging';
import * as locationServices from '../../services/location/_service.location';
import { sortDistrict } from './handleResponse/sortDistrict';

const readAllLocationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logging.info('Read all locations controller start ...');

    var { lang = "" , search} = req.query;
    if (lang.toString().trim() != "") {
      if ((lang.toString().trim() != 'vi' && lang.toString().trim() != 'en' && lang.toString().trim() != 'ko')) {
        logging.warning("Invalid language");
        return next(createError(400));
      }
    } else {
      lang = "vi"
    }

    // READ ALL PROVINCES
    const provinces = await locationServices.readAllProvinces(search ? search.toString() : null);
    if (!provinces) {
      return next(createError(500));
    }

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
    // LOOP EACH PROVINCE
    const locations = await Promise.all(
      wantedProvinces.map(async (province) => {
        // GET DISTRICTS BY PROVINCE
        let districts = await locationServices.readDistrictsByProvince(
          province.id,
          lang.toString()
        );
        // Sort
        districts = sortDistrict(districts);
        districts = await Promise.all(
          districts.map(async (district) => {

            if (lang.toString().trim() == "en" || lang.toString().trim() == "ko") {

              // get list wards en
              const wards = await locationServices.readWardsEnByDistrict(
                district.id
              );
              // Sort
              wards.sort((a, b) => a.full_name.localeCompare(b.full_name));
              //return list wards en
              return {
                district_id: district.id,
                district: district.full_name_en,
                wards: wards,
              };
            } else {

              // get list wards vn
              const wards = await locationServices.readWardsByDistrictService(
                district.id
              );
              // Sort
              wards.sort((a, b) => a.full_name.localeCompare(b.full_name));
              //retrun list wards vn
              return {
                district_id: district.id,
                district: district.full_name,
                wards: wards,
              };
            }

          })
        );
        if (lang.toString().trim() == "en" || lang.toString().trim() == "ko") {
          // return province with name english
          return {
            province_id: province.id,
            province_fullName: province.full_name_en,
            province_name: province.name_en,
            districts: districts,
          };
        }
        return {
          province_id: province.id,
          province_fullName: province.full_name,
          province_name: province.name,
          districts: districts,
        };
      })
    );

    // SUCCESS
    return res.status(200).json({
      code: 200,
      success: true,
      data: locations,
      message: 'Successfully',
    });
  } catch (error) {
    logging.error('Read all locations controller has error: ', error);
    return next(createError(500));
  }
};

export default readAllLocationsController;
