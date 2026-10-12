export interface UserProfileApiResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: UserProfile;
    message: string;
    timestamp: string;
}
export interface UserProfile {
    _id: string;
    name: string;
    last_name: string;
    profile_pic?: null;
    email: string;
    phone_number: string;
    device_id?: null;
    status: boolean;
    fcm_token?: null;
    deletedAt?: null;
    country: string;
    phone_country_code: string;
    country_code: string;
    state_code: string;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
    membership?: null;
    activeMembership: boolean;
    address: Address;
}
export interface Address {
    _id: string;
    guest_user?: null;
    first_name: string;
    last_name: string;
    email?: string | null;
    type?: null;
    phone_country_code: string;
    phone_number: string;
    country_code: string;
    city: string;
    state: string;
    state_code: string;
    country: string;
    street_address: string;
    postal_code: string;
    user_id: string;
    is_default: boolean;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
}
