import { DatabaseError, DatabaseErrorStatus } from "../../../../configs/database/database.error";

export function getError(error: DatabaseError, lang: string = "en") {
    switch (error.code) {
        case DatabaseErrorStatus.PROTOCOL_CONNECTION_LOST:
            switch (lang) {
                case "vi":
                    return "Mất kết nối đến cơ sở dữ liệu";
                case "en":
                    return "Lost connection to database";
                default:
                    return "Lost connection to database";
            }
        case DatabaseErrorStatus.ER_CMD_CONNECTION_CLOSED:
            switch (lang) {
                case "vi":
                    return "Mất kết nối đến cơ sở dữ liệu";
                case "en":
                    return "Lost connection to database";
                default:
                    return "Lost connection to database";
            }
        case DatabaseErrorStatus.ER_DUP_ENTRY:
            switch (lang) {
                case "vi":
                    return "Từ khóa đã tồn tại";
                case "en":
                    return "Keyword already exists";
                default:
                    return "Keyword already exists";
            }
        case DatabaseErrorStatus.ER_NO_REFERENCED_ROW_2:
            switch (lang) {
                case "vi":
                    return "Không tồn tại category hoặc district";
                case "en":
                    return "Category or district does not exist";
                default:
                    return "Category or district does not exist";
            }
        case DatabaseErrorStatus.ER_DATA_TOO_LONG:
            switch (lang) {
                case "vi":
                    return "Dữ liệu quá dài";
                case "en":
                    return "Data too long";
            }
        default:
            switch (lang) {
                case "vi":
                    return "Lỗi cơ sở dữ liệu";
                case "en":
                    return "Database error";
                default:
                    return "Database error";
            }
    }
}