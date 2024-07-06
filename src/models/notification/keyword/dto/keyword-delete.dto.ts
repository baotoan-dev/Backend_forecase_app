import { Request } from "express";

export class DeleteKeywordNotificationDto {
    constructor(
        public keywordNotificationIds: number[],
        public accountId: string
    ) { }

    public static fromRequest(req: Request): DeleteKeywordNotificationDto {
        return new DeleteKeywordNotificationDto(
            req.body.keywordNotificationIds,
            req.user.id
        );
    }

    public static validate(dto: DeleteKeywordNotificationDto): boolean {
        if (
            !dto.keywordNotificationIds ||
            !dto.accountId
        ) {
            return false;
        }
        if (
            !Array.isArray(dto.keywordNotificationIds) ||
            !dto.keywordNotificationIds.length ||
            typeof dto.accountId !== "string"
        ) {
            return false;
        }

        dto.keywordNotificationIds.forEach((id) => {
            if (isNaN(+id)) {
                return false;
            }
        });

        return true;
    }

}