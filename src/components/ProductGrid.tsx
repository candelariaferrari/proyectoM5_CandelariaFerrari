import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";

export const ProductGrid = () => {
  const { products } = useProducts();

  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};