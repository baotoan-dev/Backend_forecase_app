interface PostService {
    id?: number; // id of post
    post_id?: number; // id of post
    account_id: string; // id of owner
    title: string;
    company_name: string;
    latitude?: number;
    longitude?: number;
    address: string;
    salary_type: string;
    salary_type_id: number;
    start_date?: string;
    end_date?: string;
    start_time: string;
    end_time: string;
    salary_min: number;
    salary_max: number;
    money_type: '0' | '1';
    created_at: string;
    ward_id: string;
    ward: string;
    ward_name: string;
    district_id: string;
    district: string;
    district_name: string;
    province_id: string;
    province: string;
    province_name: string;
    image?: string;
    description: string;
    phone_contact: string;
    is_date_period: number;
    is_working_weekend: number;
    is_remotely: "0" | "1";
    status: 0 | 1 | 2 | 3 | 4;
    is_inhouse_data: "0" | "1";
    updated_at?: string;
    job_type?: number;
    job_type_name?: string;
    url?: string;
    serviceType?: string;
    company_resource?: number;
    company_resource_name?: string;
    company_resource_icon?: string;
    expired_date?: string;
    email: string;
    description_application?: string;
}

interface PostResponse {
    id?: number;
    post_id?: number;
    account_id: string;
    title: string;
    company_name: string;
    address: string;
    salary_type: string;
    salary_type_id: number;
    start_date?: number | null;
    end_date?: number | null;
    start_time: number;
    end_time: number;
    salary_min: number;
    salary_max: number;
    money_type: number;
    money_type_text: string;
    description: string;
    phone_contact: string;
    is_date_period: number;
    is_working_weekend: number;
    is_remotely: number;
    is_inhouse_data: number;
    created_at: number;
    latitude?: number;
    longitude?: number;
    image?: string;
    status: 0 | 1 | 2 | 3 | 4;
    updated_at?: number;
    ward_id: string;
    ward: string;
    ward_name: string;
    district_id: string;
    district: string;
    district_name: string;
    province_id: string;
    province: string;
    province_name: string;
    bookmarked?: boolean;
    share_link?: string;
    description_application?: string;
    email: string;
    job_type?: {
        job_type_id?: number;
        job_type_name?: string;
    }
    resource?: {
        company_resource_id?: number;
        company_resource_name?: string;
        url?: string;
        company_icon?: string;
    },
    serviceType?: string;
    expired_date?: number;
    created_at_text?: string;

    [key: string]: any;
}

export { PostService, PostResponse };