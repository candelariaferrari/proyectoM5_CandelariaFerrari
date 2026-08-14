import type { Product } from "../types/product.types";
import { useCart } from "../hooks/useCart"; // 👈 sin esto en props, evita el prop drilling

interface ProductCardProps {
  product: Product; // solo el dato del ítem, no funciones de cart
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-card p-3 flex flex-col gap-1.5 shadow-card">
      <div className="w-full aspect-square rounded-input bg-card-surface" />
      <div className="text-[10px] uppercase tracking-wide text-azul-cobalto font-semibold">
        {product.categoryId}
      </div>
      <div className="font-bold text-sm leading-tight text-azul-noche">{product.name}</div>
      <div className="font-bold text-sm text-azul-noche">${product.price.toLocaleString("es-AR")}</div>
      <button
        onClick={() => addToCart(product)}
        className="mt-1 text-xs font-bold text-white bg-mostaza rounded-pill py-2"
      >
        Agregar al carrito
      </button>
    </div>
  );
};