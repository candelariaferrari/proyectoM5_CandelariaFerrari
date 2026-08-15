import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";

export const ProductGrid = () => {
  const { products, loading } = useProducts();

  if (loading) {
    return <p className="text-sm text-azul-noche/60">Cargando productos...</p>;
  }

  if (products.length === 0) {
    return (
      <p className="text-sm text-azul-noche/60">
        No encontramos productos en esta categoría.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
