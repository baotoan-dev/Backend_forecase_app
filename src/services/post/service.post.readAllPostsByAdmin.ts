import logging from "../../utils/logging";
import { executeQuery } from "../../configs/database/database";

// const readAllPostsByAdmin = async () => {
//     try {
//         logging.info("Read posts service start ...");
//         const query =
//             "SELECT " +
//             // "COUNT(posts.id) OVER() as total, " +
//             "posts.id, " +
//             "posts.status, " +
//             "posts.account_id, " +
//             "posts.title, " +
//             "posts.company_name, " +
//             "posts.created_at, " +
//             "profiles.name as poster, " +
//             "posts.address, " +
//             "posts.ward_id, " +
//             "wards.full_name as ward," + 
//             "wards.name as ward_name," +
//             "districts.id as district_id," +
//             "districts.full_name as district," + 
//             "districts.name as district_name," +
//             "provinces.full_name as province," +
//             "provinces.name as province_name," +
//             "provinces.id as province_id " +
//             "FROM posts " +
//             "LEFT JOIN profiles " +
//             "ON profiles.id = posts.account_id " +
//             "LEFT JOIN wards " +
//             "ON wards.id = posts.ward_id " +
//             "LEFT JOIN districts " +
//             "ON districts.id = wards.district_id " +
//             "LEFT JOIN provinces " +
//             "ON provinces.id = districts.province_id " +
//             "GROUP BY posts.id " +
//             "ORDER BY posts.id DESC ";
//             const res = await executeQuery(query);
//         return res ? res : null;
//     } catch (error) {
//         logging.error("Read posts service has error: ", error);
//         throw error;
//     }
// };


// Phân trang 

const readAllPostsByAdmin = async () => {
  try {
    logging.info("Read posts service start ...");

    // const countQuery = "SELECT COUNT(*) as total FROM posts";
    // const countResult = await executeQuery(countQuery);
    // const totalPosts = countResult[0].total;

    const query =
      "SELECT " +
      "posts.id, " +
      "posts.status, " +
      "posts.account_id, " +
      "posts.title, " +
      "posts.company_name, " +
      "posts.created_at, " +
      "profiles.name as poster, " +
      "posts.address, " +
      "posts.ward_id, " +
      "wards.full_name as ward," +
      "wards.name as ward_name," +
      "districts.id as district_id," +
      "districts.full_name as district," +
      "districts.name as district_name," +
      "provinces.full_name as province," +
      "provinces.name as province_name," +
      "provinces.id as province_id " +
      "FROM posts " +
      "LEFT JOIN profiles " +
      "ON profiles.id = posts.account_id " +
      "LEFT JOIN wards " +
      "ON wards.id = posts.ward_id " +
      "LEFT JOIN districts " +
      "ON districts.id = wards.district_id " +
      "LEFT JOIN provinces " +
      "ON provinces.id = districts.province_id " +
      "GROUP BY posts.id " +
      "ORDER BY posts.id DESC "
    const res = await executeQuery(query);
    return { data: res ? res : null };
  } catch (error) {
    logging.error("Read posts service has error: ", error);
    throw error;
  }
};

export default readAllPostsByAdmin;
  

