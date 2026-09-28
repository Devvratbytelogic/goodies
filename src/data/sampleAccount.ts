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
    lines: [
      { slug: "strawberry-crunchy-sour-snack", quantity: 1, price: 27 },
      { slug: "orange-mango-icy-with-real-fruits", quantity: 2, price: 32 },
    ],
  },
  {
    id: "GD-1038",
    placedOn: "2026-08-28",
    status: "shipped",
    lines: [{ slug: "crunchy-choco-brownies-icy", quantity: 1, price: 25 }],
  },
  {
    id: "GD-1011",
    placedOn: "2026-07-04",
    status: "processing",
    lines: [{ slug: "crunchy-strawberry-cashew-snack", quantity: 2, price: 35 }],
  },
] as const;

export const sampleCoupons = [
  { code: "GOODIES10", labelKey: "couponPercent" },
  { code: "TREAT20", labelKey: "couponFixed" },
  { code: "FREESHIP", labelKey: "couponShipping" },
] as const;

export const sampleUsedCoupons = [
  { code: "WELCOME15", labelKey: "couponWelcome", usedOn: "2026-08-28", orderId: "GD-1038" },
  { code: "SWEET25", labelKey: "couponSweet", usedOn: "2026-07-04", orderId: "GD-1011" },
] as const;

export type AccountOrderStatus = (typeof sampleOrders)[number]["status"];
