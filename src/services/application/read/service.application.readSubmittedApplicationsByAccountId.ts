import logging from "../../../utils/logging";
import { executeQuery } from "../../../configs/database/database";

const readSubmittedApplicationByAccountIdService = async (
  lang: string | null = "vi",
  accountId: string,
  limit: number | null,
  page: number | null
) => {
  try {
    logging.info("Read submitted applications by account id service start ...");
    const offset = limit && page ? (page) * limit : 0;

    const query =
      "SELECT " +
      "applications.id, " +
      "applications.post_id, " +
      "applications.account_id, " +
      "applications.status as application_status, " +
      "applications.created_at, " +
      "applications.description, " + 
      "posts.title, " +
      "posts.company_name, " +
      "posts.start_date, " +
      "posts.end_date, " +
      "posts.salary_min, " +
      "posts.salary_max, " +
      "posts.status as post_status, " +
      ` ${lang === "vi" ? "wards.full_name" : "wards.full_name_en"} as ward,` +
      "wards.name as ward_name," +
      "districts.id as district_id," +
      ` ${
        lang === "vi" ? "districts.full_name" : "districts.full_name_en"
      } as district,` +
      "districts.name as district_name," +
      ` ${
        lang === "vi" ? "provinces.full_name" : "provinces.full_name_en"
      } as province,` +
      "provinces.name as province_name," +
      "provinces.id as province_id," +
      "posts.salary_type as salary_type_id, " +
      "post_images.image as image, " +
      ` ${
        lang === "vi"
          ? "salary_types.value"
          : lang === "en"
          ? "salary_types.value_en"
          : "salary_types.value_ko"
      } as salary_type,` +
      "company_resource.icon as company_resource_icon, " +
      "posts.is_inhouse_data, " +
      "posts.money_type, " +
      "posts.job_type, " +
      `${
        lang === "vi"
          ? "job_types.name"
          : lang === "en"
          ? "job_types.name_en"
          : "job_types.name_ko"
      } as job_type_name, ` +
      " posts.expired_date " +
      " FROM applications" +
      " LEFT JOIN posts ON applications.post_id = posts.id" +
      " LEFT JOIN wards ON posts.ward_id = wards.id" +
      " LEFT JOIN districts ON wards.district_id = districts.id" +
      " LEFT JOIN provinces ON districts.province_id = provinces.id" +
      " LEFT JOIN post_images ON posts.id = post_images.post_id" +
      " LEFT JOIN salary_types ON posts.salary_type = salary_types.id" +
      " LEFT JOIN post_resource" +
      " ON post_resource.post_id = posts.id" +
      " LEFT JOIN company_resource" +
      " ON company_resource.id = post_resource.company" +
      " LEFT JOIN job_types ON posts.job_type = job_types.id" +
      " WHERE applications.account_id = ?" +
      " GROUP BY applications.id" +
      " ORDER BY applications.id DESC" +
      " LIMIT ? OFFSET ?"; 
    const params: any[] = [accountId, limit || 0, offset];

    const res = await executeQuery(query, params);
    // console.log(res);
    return res ? res : null;
  } catch (error) {
    logging.error(
      "Read submitted applications by account id service has error: ",
      error
    );
    return null;
  }
};

export default readSubmittedApplicationByAccountIdService;
