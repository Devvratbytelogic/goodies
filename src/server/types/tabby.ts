export interface TabbySessionPayload {
    shipping_address_id: string;
    billing_address_id: string;
    customer_note: string;
    country: string;
    origin: string;
}
export interface TabbySessionResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: TabbySession;
    message: string;
    timestamp: string;
}
export interface TabbySession {
    order_id: string;
    order_number: number;
    payment_id: string;
    payment_url?: string | null;
    amount: number;
    currency: string;
}
