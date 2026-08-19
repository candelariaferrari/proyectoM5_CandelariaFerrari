import type { Product } from "../../types/product.types";
import { useProducts } from "../../hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
//contenedor

interface ProductGridProps { //para cuando ek contenedor padre ya filtro 
  products?: Product[];
}

const SKELETON_COUNT = 8;

export const ProductGrid = ({ products: productsProp }: ProductGridProps) => {
  const { products: contextProducts, loading } = useProducts();
  const products = productsProp ?? contextProducts;

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
