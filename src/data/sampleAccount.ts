export const sampleProfile = {
  firstName: "Layla",
  lastName: "Hassan",
  email: "layla@example.com",
  phone: "+971 50 123 4567",
} as const;

export const sampleOrders = [
  {
    id: "GD-1042",
    placedOn: "2026-09-12",
    status: "delivered",
    shipping: 15,
    trackingNumber: "GD1042928413",
    history: [
      { step: "placed", at: "2026-09-12T06:24:00Z" },
      { step: "processing", at: "2026-09-12T10:05:00Z" },
      { step: "shipped", at: "2026-09-13T05:40:00Z" },
      { step: "delivered", at: "2026-09-14T14:15:00Z" },
    ],
    lines: [
      { slug: "strawberry-crunchy-sour-snack", quantity: 1, price: 27 },
      { slug: "orange-mango-icy-with-real-fruits", quantity: 2, price: 32 },
    ],
  },
  {
    id: "GD-1038",
    placedOn: "2026-08-28",
    status: "shipped",
    shipping: 15,
    trackingNumber: "GD1038829104",
    history: [
      { step: "placed", at: "2026-08-28T07:10:00Z" },
      { step: "processing", at: "2026-08-28T11:30:00Z" },
      { step: "shipped", at: "2026-08-29T06:05:00Z" },
    ],
    lines: [{ slug: "crunchy-choco-brownies-icy", quantity: 1, price: 25 }],
  },
  {
    id: "GD-1011",
    placedOn: "2026-07-04",
    status: "processing",
    shipping: 15,
    trackingNumber: null,
    history: [
      { step: "placed", at: "2026-07-04T08:20:00Z" },
      { step: "processing", at: "2026-07-04T12:45:00Z" },
    ],
    lines: [{ slug: "crunchy-strawberry-cashew-snack", quantity: 2, price: 35 }],
  },
] as const;

export const sampleCoupons = [
  { code: "GOODIES10", labelKey: "couponPercent" },
  { code: "TREAT20", labelKey: "couponFixed" },
  { code: "FREESHIP", labelKey: "couponShipping" },
] as const;

export const sampleUsedCoupons = [
  { code: "WELCOME15", labelKey: "couponWelcome", usedOn: "2026-08-28", orderId: "GD-1038", discount: 15 },
  { code: "SWEET25", labelKey: "couponSweet", usedOn: "2026-07-04", orderId: "GD-1011", discount: 25 },
] as const;

export type AccountOrderStatus = (typeof sampleOrders)[number]["status"];
