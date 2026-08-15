import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Product } from "../types/product.types";
import { getProductsById } from "../services/products.services";
import { useCart } from "../hooks/useCart";

export const ProductDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getProductsById(id).then((result) => {
      setProduct(result);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <p className="p-6 text-center text-azul-noche">Cargando producto...</p>;
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p className="text-azul-noche mb-3">No encontramos este producto.</p>
        <Link to="/" className="text-azul-cobalto font-bold underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 grid gap-8 md:grid-cols-2">
      <div className="w-full aspect-square rounded-card bg-card-surface overflow-hidden">
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Link to="/" className="text-xs text-azul-cobalto font-semibold underline w-fit">
          ← Volver al catálogo
        </Link>

        <div className="text-[11px] uppercase tracking-wide text-azul-cobalto font-semibold">
          {product.categoryId} · +{product.minAge} años
        </div>

        <h1 className="text-2xl font-bold text-azul-noche">{product.name}</h1>

        <div className="flex items-center gap-1 text-sm text-azul-noche">
          <span>★ {product.rating.rate.toFixed(1)}</span>
          <span className="text-xs text-azul-noche/60">({product.rating.count} reseñas)</span>
        </div>

        <p className="text-2xl font-bold text-azul-noche">
          ${product.price.toLocaleString("es-AR")}
        </p>

        <p className="text-sm text-azul-noche/80 leading-relaxed">{product.description}</p>

        <p className="text-xs text-azul-noche/60">
          {product.stock > 0 ? `Stock disponible: ${product.stock}` : "Sin stock"}
        </p>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="mt-2 text-sm font-bold text-white bg-mostaza rounded-pill py-3 disabled:opacity-40"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};
