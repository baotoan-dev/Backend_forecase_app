import { Request } from "express";
import isBoolean from "validator/lib/isBoolean";
import isNumeric from "validator/lib/isNumeric";

export class CreateKeywordNotificationDto {
    constructor(
        public keyword: string,
        public category_id: number,
        public category_status: number,
        public district_id: string,
        public district_status: number,
        public accountId: string
    ) { }

    public static fromRequest(req: Request): CreateKeywordNotificationDto {
        return new CreateKeywordNotificationDto(
            req.body.keyword,
            +req.body.category_id,
            +req.body.category_status,
            req.body.district_id,
            +req.body.district_status,
            req.user.id
        );
    }

    public static validate(dto: CreateKeywordNotificationDto): boolean {
        if (
            !dto.keyword ||
            !dto.category_id ||
            !dto.district_id ||
            !dto.accountId ||
            dto.category_status === undefined ||
            dto.district_status === undefined
        ) {
            return false;
        }
        if (
            typeof dto.keyword !== "string" ||
            isNaN(+dto.category_id) ||
            (dto.category_status !== 0 && dto.category_status !== 1) ||
            !isNumeric(dto.district_id) ||
            (dto.district_status !== 0 && dto.district_status !== 1) ||
            typeof dto.accountId !== "string"
        ) {
            return false;
        }
        return true;
    }

    public static sanitize(
        dto: CreateKeywordNotificationDto
    ): CreateKeywordNotificationDto {
        return new CreateKeywordNotificationDto(
            dto.keyword,
            +dto.category_id,
            dto.category_status,
            dto.district_id,
            dto.district_status,
            dto.accountId
        );
    }

    public static toResponse(
        dto: CreateKeywordNotificationDto
    ): CreateKeywordNotificationDto {
        return new CreateKeywordNotificationDto(
            dto.keyword,
            +dto.category_id,
            dto.category_status,
            dto.district_id,
            dto.district_status,
            dto.accountId
        );
    }
}
