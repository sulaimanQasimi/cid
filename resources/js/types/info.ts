export interface InfoType {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface InfoCategory {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Info {
    id: number;
    info_type_id: number;
    info_category_id: number;
    name: string | null;
    code: string | null;
    description: string | null;
    value: any;
    user_id: number | null;
    confirmed: boolean;
    created_by: number | null;
    confirmed_by: number | null;
    created_at: string;
    updated_at: string;
    infoType?: InfoType;
    infoCategory?: InfoCategory;
    user?: User;
    creator?: User;
    confirmer?: User;
}