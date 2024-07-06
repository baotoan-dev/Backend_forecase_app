import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

const filterPostsService = async (wardId:String) => {   
    try {
        logging.info("filter posts service start ...");
        const query =
           "SELECT posts.id ,title,company_name,created_at,status,"+
           "concat (wards.full_name, ', ' ,districts.full_name ,', ' , provinces.full_name ) AS address "+           
           "FROM posts "+
           "left JOIN wards ON posts.ward_id = wards.id "+
           "left JOIN districts ON districts.id = wards.district_id "+
           "left JOIN provinces ON provinces.id = districts.province_id "+
           `${wardId.length>0 ? "WHERE wards.id = ?" : ""}`+
          " ORDER BY created_at desc"
          const params = [wardId];
          const res = await executeQuery(query,params);
        return res ? res : null;
    } catch (error) {
        logging.error("Read posts service has error: ", error);
        throw error;
    }
};

export default filterPostsService;
