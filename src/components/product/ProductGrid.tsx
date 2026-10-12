import ProductCard from "@/components/product/ProductCard";
import { HomeProduct } from "@/server/types/Home";

export default function ProductGrid({ products }: { products: HomeProduct[] }) {
  return (
    <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
      {products.length > 0 ? products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      )) : (
        <li>
          <p>No products found</p>
        </li>
      )}
    </ul>
  );
}
