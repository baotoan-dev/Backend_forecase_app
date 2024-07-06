export class KeywordNotificationEntity {
    constructor(
        public id: number,
        public accountId: string,
        public keyword: string,
        public districtId: string,
        public districtName: string,
        public districtStatus: number,
        public provinceId: string,
        public provinceName: string,
        public categoryId: string,
        public categoryName: string,
        public categoryStatus: number,
        public status: number,
        public createdAt: Date,
    ) { }

    static fromObject(object: any) {
        return new KeywordNotificationEntity(
            object.id,
            object.account_id,
            object.keyword,
            object.district_id,
            object.district_name,
            object.district_status,
            object.province_id,
            object.province_name,
            object.category_id,
            object.category_name,
            object.category_status,
            object.status,
            object.created_at,
        );
    }

    static toResponse(entity: KeywordNotificationEntity) {
        return {
            id: entity.id,
            account_id: entity.accountId,
            keyword: entity.keyword,
            district: {
                id: entity.districtId,
                name: entity.districtName,
                status: entity.districtStatus,
            },
            province: {
                name: entity.provinceName,
            },
            category: {
                id: entity.categoryId,
                name: entity.categoryName,
                status: entity.categoryStatus,
            },
            status: entity.status,
            created_at: entity.createdAt.getTime(),
        };
    }
}