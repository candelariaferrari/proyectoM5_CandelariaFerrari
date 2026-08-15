import type { Product } from "../types/product.types";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  // Opcional: si no se pasa, usa los productos tal cual vienen del Context.
  // La página de catálogo lo usa para aplicarle el filtro de precio (que es
  // solo del lado del cliente) antes de mostrarlos.
  products?: Product[];
}

export const ProductGrid = ({ products: productsProp }: ProductGridProps) => {
  const { products: contextProducts, loading } = useProducts();
  const products = productsProp ?? contextProducts;

  if (loading) {
    return <p className="text-sm text-azul-noche/60">Cargando productos...</p>;
  }

  if (products.length === 0) {
    return (
      <p className="text-sm text-azul-noche/60">
        No encontramos productos con estos filtros.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
