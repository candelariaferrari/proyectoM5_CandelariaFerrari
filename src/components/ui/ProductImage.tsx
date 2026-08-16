import { useState } from "react";
import { CATEGORY_INFO } from "../../constants/categories";
import type { CategoryId } from "../../types/product.types";

interface ProductImageProps {
  imageUrl?: string;
  categoryId: CategoryId;
  alt: string;
  className?: string; // controla tamaño/bordes, se aplica tanto a la imagen como al placeholder
}

// Si el producto no tiene `imageUrl`, o la que tiene falla al cargar (link
// roto, no llegamos a subirla todavía), mostramos un cuadrado del color de
// su categoría con el ícono correspondiente, en vez del ícono de imagen
// rota que pone el navegador por default.
export const ProductImage = ({ imageUrl, categoryId, alt, className = "" }: ProductImageProps) => {
  const [failedToLoad, setFailedToLoad] = useState(false);
  const category = CATEGORY_INFO[categoryId];
  const Icon = category.icon;

  if (!imageUrl || failedToLoad) {
    return (
      <div className={`${category.color} flex items-center justify-center ${className}`}>
        <Icon className="text-white/70" size={28} />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      onError={() => setFailedToLoad(true)}
      className={`object-cover ${className}`}
    />
  );
};
