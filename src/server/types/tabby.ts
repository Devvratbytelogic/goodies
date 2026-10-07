export interface TabbySessionPayload {
    shipping_address_id: string;
    billing_address_id: string;
    customer_note: string;
    country: string;
    origin: "web";
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

export interface TabbyPaymentResponse {
    success: boolean;
    message: string;
    data: TabbyPayment;
}
export interface TabbyPayment {
    payment_id: string;
    status: "CREATED" | "AUTHORIZED" | "CLOSED" | "REJECTED" | "EXPIRED";
    order_id?: string | null;
}
