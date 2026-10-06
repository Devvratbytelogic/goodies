export interface AddressApiResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: AddressEntity[] | null;
    message: string;
    timestamp: string;
}
export interface AddressEntity {
    _id: string;
    guest_user?: string | null;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone_number: string;
    country_code: string;
    city: string;
    state: string;
    country: string;
    street_address: string;
    postal_code: string;
    user_id?: string | null;
    is_default: boolean;
    deletedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
}
