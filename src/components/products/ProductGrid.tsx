import type { Product } from "../../types/product.types";
import { useProducts } from "../../hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

interface ProductGridProps {
  // Opcional: si no se pasa, usa los productos tal cual vienen del Context.
  // La página de catálogo lo usa para aplicarle el filtro de precio (que es
  // solo del lado del cliente) antes de mostrarlos.
  products?: Product[];
}

// Cuántas cards-esqueleto mostrar mientras carga: no sabemos todavía
// cuántos productos van a llegar, así que usamos un número que llena bien
// la grilla en desktop (2 filas de 4) sin ser exagerado en mobile.
const SKELETON_COUNT = 8;

export const ProductGrid = ({ products: productsProp }: ProductGridProps) => {
  const { products: contextProducts, loading } = useProducts();
  const products = productsProp ?? contextProducts;

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* key=index está bien acá: son placeholders sin identidad propia (no representan ningún producto real todavía) */}
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
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
