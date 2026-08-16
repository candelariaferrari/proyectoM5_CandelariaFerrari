import { Link } from "react-router-dom";
import type { Product } from "../types/product.types";
import { CATEGORY_INFO } from "../constants/categories";
import { useCart } from "../hooks/useCart"; // 👈 sin esto en props, evita el prop drilling
import { ProductImage } from "./ui/ProductImage";

interface ProductCardProps {
  product: Product; // solo el dato del ítem, no funciones de cart
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const category = CATEGORY_INFO[product.categoryId];

  return (
    <div className="bg-white rounded-card p-3 flex flex-col gap-1.5 shadow-card">
      <Link to={`/producto/${product.id}`}>
        <div className="w-full aspect-square rounded-input overflow-hidden">
          <ProductImage
            imageUrl={product.imageUrl}
            categoryId={product.categoryId}
            alt={product.name}
            className="w-full h-full"
          />
        </div>
      </Link>
      <div className={`text-[10px] uppercase tracking-wide font-semibold ${category.textColor}`}>
        {category.label}
      </div>
      <Link to={`/producto/${product.id}`} className="font-bold text-sm leading-tight text-azul-noche">
        {product.name}
      </Link>
      <div className="flex items-center gap-1 text-xs text-azul-noche/70">
        <span>★ {product.rating.rate.toFixed(1)}</span>
        <span>({product.rating.count})</span>
      </div>
      <div className="font-bold text-base text-azul-noche">${product.price.toLocaleString("es-AR")}</div>
      <button
        onClick={() => addToCart(product)}
        className="mt-1 text-xs font-bold text-white bg-mostaza rounded-pill py-2"
      >
        Agregar al carrito
      </button>
    </div>
  );
};
