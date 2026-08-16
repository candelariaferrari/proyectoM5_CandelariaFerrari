import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Product } from "../types/product.types";
import { getProductsById } from "../services/products.services";
import { useCart } from "../hooks/useCart";
import { CATEGORY_INFO } from "../constants/categories";

export const ProductDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    // Falso positivo conocido de esta regla (nueva en eslint-plugin-react-hooks
    // v7) con el patrón estándar de fetch: mostrar loading mientras se pide
    // el dato de nuevo cada vez que cambia la dependencia.
    // https://github.com/react/react/issues/34743
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setQuantity(1);
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

  const category = CATEGORY_INFO[product.categoryId];
  const inStock = product.stock > 0;

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => Math.min(product.stock, q + 1));

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      {/* Breadcrumb: ayuda a orientarse y da un camino rápido de vuelta a la categoría */}
      <nav className="text-xs text-azul-noche/50 font-semibold mb-5">
        <Link to="/" className="hover:underline">
          Inicio
        </Link>
        {" › "}
        <Link to={`/productos?categoria=${product.categoryId}`} className="hover:underline">
          {category.label}
        </Link>
        {" › "}
        <span className="text-azul-noche">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="w-full aspect-square rounded-card bg-card-surface overflow-hidden">
          {product.imageUrl && (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <span className={`${category.color} text-white text-xs font-bold px-3 py-1.5 rounded-pill`}>
              {category.label}
            </span>
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-pill ${
                inStock ? "bg-stock-ok text-verde-menta" : "bg-stock-low text-danger"
              }`}
            >
              {inStock ? `En stock · ${product.stock}` : "Sin stock"}
            </span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-pill bg-card-surface text-azul-noche">
              Edad +{product.minAge} años
            </span>
          </div>

          <h1 className="text-3xl font-heading font-extrabold text-azul-noche">{product.name}</h1>

          <div className="flex items-center gap-1 text-sm text-azul-noche">
            <span>★ {product.rating.rate.toFixed(1)}</span>
            <span className="text-xs text-azul-noche/60">({product.rating.count} reseñas)</span>
          </div>

          <p className="text-3xl font-heading font-extrabold text-rosa-coral">
            ${product.price.toLocaleString("es-AR")}
          </p>

          <p className="text-sm text-azul-noche/80 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3 mt-2">
            {/* Selector de cantidad: acotado entre 1 y el stock disponible */}
            <div className="flex items-center gap-3 bg-card-surface rounded-pill px-2 py-1.5">
              <button
                onClick={decreaseQty}
                disabled={quantity <= 1}
                className="w-7 h-7 rounded-full bg-white text-azul-noche font-bold disabled:opacity-40"
                aria-label="Restar"
              >
                −
              </button>
              <span className="w-4 text-center font-bold text-azul-noche">{quantity}</span>
              <button
                onClick={increaseQty}
                disabled={quantity >= product.stock}
                className="w-7 h-7 rounded-full bg-white text-azul-noche font-bold disabled:opacity-40"
                aria-label="Sumar"
              >
                +
              </button>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              disabled={!inStock}
              className="flex-1 text-sm font-bold text-azul-noche bg-mostaza rounded-pill py-3 disabled:opacity-40"
            >
              Agregar al carrito · ${(product.price * quantity).toLocaleString("es-AR")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
