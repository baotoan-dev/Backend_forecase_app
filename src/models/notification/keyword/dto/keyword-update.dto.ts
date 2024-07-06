import { Request } from "express";

export class UpdateKeywordNotificationStatusDto {
  constructor(
    public keywordNotificationId: number,
    public accountId: string,
    // public districtStatus: number,
    // public categoryStatus: number,
    public status?: number
  ) { }

  public static fromRequest(req: Request): UpdateKeywordNotificationStatusDto {
    return new UpdateKeywordNotificationStatusDto(
      +req.body.id,
      req.user.id,
      // +req.body.district_status,
      // +req.body.category_status,
      +req.body.status
    );
  }

  public static validate(dto: UpdateKeywordNotificationStatusDto): boolean {
    if (
      !dto.keywordNotificationId ||
      !dto.accountId ||
      // dto.districtStatus === undefined ||
      // dto.categoryStatus === undefined ||
      dto.status === undefined
    ) {
      return false;
    }
    if (
      isNaN(+dto.keywordNotificationId) ||
      typeof dto.accountId !== "string" ||
      // (dto.districtStatus !== 0 && dto.districtStatus !== 1) ||
      // (dto.categoryStatus !== 0 && dto.categoryStatus !== 1) ||
      (dto.status !== 0 && dto.status !== 1)
    ) {
      return false;
    }
    return true;
  }

  public static sanitize(
    dto: UpdateKeywordNotificationStatusDto
  ): UpdateKeywordNotificationStatusDto {
    return new UpdateKeywordNotificationStatusDto(
      +dto.keywordNotificationId,
      dto.accountId,
      // dto.districtStatus,
      // dto.categoryStatus,
      dto.status
    );
  }

  public static toResponse(
    dto: UpdateKeywordNotificationStatusDto
  ): UpdateKeywordNotificationStatusDto {
    return new UpdateKeywordNotificationStatusDto(
      +dto.keywordNotificationId,
      dto.accountId,
      // dto.districtStatus,
      // dto.categoryStatus,
      dto.status
    );
  }
}
