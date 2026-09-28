import { getTranslations } from "next-intl/server";
import { sampleOrders, type AccountOrderStatus } from "@/data/sampleAccount";
import { getProductBySlug } from "@/data/products";

export type AccountOrderLine = {
  slug: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
};

export type AccountOrder = {
  id: string;
  placedOn: string;
  status: AccountOrderStatus;
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

    return {
      id: order.id,
      placedOn: order.placedOn,
      status: order.status,
      total: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
      lines,
    };
  });
}
