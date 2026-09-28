import { getTranslations } from "next-intl/server";
import { sampleOrders, sampleUsedCoupons, type AccountOrderStatus } from "@/data/sampleAccount";
import { getProductBySlug } from "@/data/products";

export const orderTrackingSteps = ["placed", "processing", "shipped", "delivered"] as const;

export type OrderTrackingStep = (typeof orderTrackingSteps)[number];

export type AccountOrderLine = {
  slug: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
};

export type AccountOrderEvent = {
  step: OrderTrackingStep;
  at: string;
};

export type AccountOrder = {
  id: string;
  placedOn: string;
  status: AccountOrderStatus;
  trackingNumber: string | null;
  history: AccountOrderEvent[];
  subtotal: number;
  shipping: number;
  discount: number;
  couponCode: string | null;
  total: number;
  lines: AccountOrderLine[];
};

export async function getAccountOrders(): Promise<AccountOrder[]> {
  const cards = await getTranslations("ProductCard");

  return sampleOrders.map((order) => {
    const lines = order.lines.map((line) => {
      const product = getProductBySlug(line.slug);
      if (!product) {
        throw new Error(`Missing account order product: ${line.slug}`);
      }

      return {
        slug: line.slug,
        name: cards(product.nameKey),
        image: product.image,
        quantity: line.quantity,
        price: line.price,
      };
    });

    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const coupon = sampleUsedCoupons.find((item) => item.orderId === order.id);
    const discount = coupon?.discount ?? 0;

    return {
      id: order.id,
      placedOn: order.placedOn,
      status: order.status,
      trackingNumber: order.trackingNumber,
      history: order.history.map((event) => ({ step: event.step, at: event.at })),
      subtotal,
      shipping: order.shipping,
      discount,
      couponCode: coupon?.code ?? null,
      total: subtotal - discount + order.shipping,
      lines,
    };
  });
}

export async function getAccountOrder(id: string) {
  const orders = await getAccountOrders();
  return orders.find((order) => order.id === id);
}
