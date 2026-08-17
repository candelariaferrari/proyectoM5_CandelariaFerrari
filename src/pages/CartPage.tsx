import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { AuthModal } from "../components/AuthModal";
import { CloseIcon, CartIcon, ChevronUpIcon } from "../components/ui/icons";
import { ProductImage } from "../components/ui/ProductImage";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { createOrder } from "../services/orders.services";
import type { Product } from "../types/product.types";
import type { OrderItemSnapshot } from "../types/order.types";

// banner del header ("Envíos gratis en
// compras mayores a $50.000").
const FREE_SHIPPING_THRESHOLD = 50000;

export const CartPage = () => {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // Panel de compra en mobile: collapsable
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);
  const [itemPendingRemoval, setItemPendingRemoval] = useState<Product | null>(null);
  // Doble-submit: mientras se crea la orden, el botón queda deshabilitado.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const hasFreeShipping = total >= FREE_SHIPPING_THRESHOLD;
  const missing = FREE_SHIPPING_THRESHOLD - total;
  const progressPercent = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const handleQuantityChange = (id: string, quantity: number, stock: number) => {
    // clamp: nunca menos de 1 ni más del stock disponible
    const clamped = Math.min(Math.max(quantity, 1), stock);
    updateQuantity(id, clamped);
  };

  // Checkout simulado
  // creamos la orden en Firestore con un snapshot de los items (nombre y
  // precio "congelados" al momento de la compra, no una referencia al
  // producto) y recién si eso se confirma vaciamos el carrito. `isSubmitting`
  // evita que un doble click cree dos órdenes.
  const handleCheckout = async () => {
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const orderItems: OrderItemSnapshot[] = items.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        priceAtPurchase: product.price,
        quantity,
      }));

      const orderId = await createOrder(user.uid, orderItems, total);
      clearCart();
      showToast("¡Compra realizada con éxito!");
      navigate("/pedido-confirmado", { state: { orderId, items: orderItems, total } });
    } catch {
      showToast("No pudimos procesar tu compra. Probá de nuevo.", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="max-w-[1280px] mx-auto px-6 py-16 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-card-surface flex items-center justify-center">
          <CartIcon size={26} className="text-azul-noche/40" />
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-azul-noche">Tu carrito está vacío</h1>
        <p className="text-sm text-azul-noche/60">Todavía no agregaste ningún juguete.</p>
        <Link
          to="/productos"
          className="text-sm font-extrabold text-azul-noche bg-mostaza px-7 py-3.5 rounded-pill shadow-cta"
        >
          Ver productos
        </Link>
      </section>
    );
  }

  // Contenido del resumen: 
  const summaryBody = (
    <>
      <div className="flex items-center justify-between text-sm text-azul-noche/70">
        <span>Subtotal</span>
        <span>${total.toLocaleString("es-AR")}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-azul-noche/70">Envío</span>
        {hasFreeShipping ? (
          <span className="font-bold text-verde-menta">Gratis</span>
        ) : (
          <span className="text-azul-noche/50">A calcular</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-bold text-azul-noche/70">
          {hasFreeShipping
            ? "¡Tenés envío gratis!"
            : `Te faltan $${missing.toLocaleString("es-AR")} para el envío gratis`}
        </p>
        <div className="h-1.5 rounded-pill bg-white/60 overflow-hidden">
          <div
            className={`h-full rounded-pill transition-[width] ${hasFreeShipping ? "bg-verde-menta" : "bg-rosa-coral"}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="h-px bg-azul-noche/10" />

      <div className="flex items-center justify-between font-extrabold text-azul-noche">
        <span>Total</span>
        <span>${total.toLocaleString("es-AR")}</span>
      </div>

      {isAuthenticated ? (
        <button
          onClick={handleCheckout}
          disabled={isSubmitting}
          className="text-sm font-extrabold text-azul-noche bg-mostaza px-7 py-3.5 rounded-pill shadow-cta disabled:opacity-60"
        >
          {isSubmitting ? "Procesando..." : "Continuar compra"}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-sm font-extrabold text-azul-noche bg-mostaza px-7 py-3.5 rounded-pill shadow-cta"
          >
            Continuar compra
          </button>
          <p className="text-xs text-azul-noche/50 text-center">
            Necesitás iniciar sesión para continuar con la compra.
          </p>
        </div>
      )}
    </>
  );

  const summary = (
    <>
      <h2 className="font-heading font-extrabold text-lg text-azul-noche">Resumen del pedido</h2>
      {summaryBody}
    </>
  );

  return (
    <section
      className={`max-w-[1280px] mx-auto px-6 py-8 grid gap-8 md:grid-cols-[1fr_320px] md:pb-8 ${
        isSummaryExpanded ? "pb-72" : "pb-24"
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-heading font-extrabold text-2xl text-azul-noche">Tu carrito ({items.length})</h1>
          <button onClick={clearCart} className="text-sm font-bold text-azul-cobalto underline">
            Vaciar carrito
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 p-4 rounded-card bg-white border border-gris-claro">
              <ProductImage
                imageUrl={product.imageUrl}
                categoryId={product.categoryId}
                alt={product.name}
                className="w-20 h-20 rounded-card shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-azul-noche truncate">{product.name}</p>
                    <p className="text-sm text-azul-noche/60">${product.price.toLocaleString("es-AR")} c/u</p>
                  </div>
                  <p className="font-extrabold text-azul-noche shrink-0">
                    ${(product.price * quantity).toLocaleString("es-AR")}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 bg-card-surface rounded-pill px-1">
                    <button
                      onClick={() => handleQuantityChange(product.id, quantity - 1, product.stock)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-azul-noche font-bold"
                      aria-label="Restar"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-azul-noche">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product.id, quantity + 1, product.stock)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-azul-noche font-bold"
                      aria-label="Sumar"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => setItemPendingRemoval(product)}
                    className="w-7 h-7 rounded-full bg-rosa-coral text-white flex items-center justify-center"
                    aria-label="Quitar del carrito"
                  >
                    <CloseIcon size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link to="/productos" className="inline-flex items-center gap-1 text-sm font-bold text-azul-cobalto mt-6">
          ← Seguir comprando
        </Link>
      </div>

      {/* Desktop: dentro de la grilla, al lado de la lista */}
      <div className="hidden md:flex h-fit p-5 rounded-card-lg bg-crema flex-col gap-4">{summary}</div>

      {/* Mobile */}
      <div className="md:hidden fixed bottom-16 inset-x-0 z-30 bg-crema rounded-t-card-lg shadow-card">
        <button
          onClick={() => setIsSummaryExpanded((expanded) => !expanded)}
          className="w-full flex items-center justify-between px-5 py-3.5"
          aria-expanded={isSummaryExpanded}
          aria-label={isSummaryExpanded ? "Ocultar resumen del pedido" : "Mostrar resumen del pedido"}
        >
          <span className="font-heading font-extrabold text-lg text-azul-noche">
            {isSummaryExpanded ? "Resumen del pedido" : `Total: $${total.toLocaleString("es-AR")}`}
          </span>
          <ChevronUpIcon
            size={18}
            className={`text-azul-noche/60 shrink-0 transition-transform ${isSummaryExpanded ? "" : "rotate-180"}`}
          />
        </button>
        {isSummaryExpanded && <div className="px-5 pb-4 flex flex-col gap-3">{summaryBody}</div>}
      </div>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}

      {itemPendingRemoval && (
        <ConfirmDialog
          title="¿Quitar del carrito?"
          message={`"${itemPendingRemoval.name}" se eliminará de tu carrito.`}
          confirmLabel="Quitar"
          onCancel={() => setItemPendingRemoval(null)}
          onConfirm={() => {
            removeFromCart(itemPendingRemoval.id);
            setItemPendingRemoval(null);
          }}
        />
      )}
    </section>
  );
};
