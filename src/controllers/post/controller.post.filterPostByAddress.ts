import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import logging from "../../utils/logging";
import * as postServices from "../../services/post/_service.post";
import * as locationServices from "../../services/location/_service.location";
// import MoneyType from "../../enum/money_type.enum";
// import { formatPostBeforeReturn } from "./_controller.post.formatPostBeforeReturn";

const filterPostByAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logging.info(" filter post by address  controller start ...");

        const { districts_id="",provinces_id="",wards_id="" } = req.query;
       
        var data=[]

        // check valid query parameters
        if (districts_id==""&&provinces_id==""&&wards_id=="") {
                data = await postServices.filterPostsByAddress("")
                
        }else{
            if(provinces_id==""){
                if(districts_id!=""||wards_id!=""){
                    logging.warning("invalid theme id");
                   
                    return next(createError(400));
                }
            }else{
                if(districts_id==""){
                    if(wards_id!=""){
                        logging.warning("invalid theme id");
                        
                        return next(createError(400));
                    }
                }
            }
        } 
        // get list posts by ward_id
            if(wards_id!=""){          
                data = await postServices.filterPostsByAddress(wards_id.toString())
            }
             // get list posts by district_id
            if(districts_id!=""&& wards_id==""){
                const listWards = await locationServices.readWardsEnByDistrict(Number(districts_id))
               for (const wards of listWards) {
                const list = await postServices.filterPostsByAddress(wards.id)
                data.push(...list)
               }
            }
             // get list posts by provinces_id  
            if(provinces_id!=""&& districts_id==""){
                const listDistricts = await locationServices.readDistrictsByProvince(Number(provinces_id),"vn")
               for (const district of listDistricts) {
                const listWards = await locationServices.readWardsEnByDistrict(Number(district.id))

                for (const wards of listWards) {
                    const list = await postServices.filterPostsByAddress(wards.id)
                    data.push(...list)
                }
                
               }
            }

            data.sort(function(a,b){
                
                return new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf();
              });
        

        // SUCCESS
        return res.status(200).json({
            code: 200,
            success: true,
            data: data,
            message: "Successfully",
        });
    } catch (error) {
        logging.error("filter  posts by address controller has error: ", error);
        return next(createError(500));
    }
};

export default filterPostByAddress;
