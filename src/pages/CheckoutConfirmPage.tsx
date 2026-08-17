import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { createOrder } from "../services/orders.services";
import { OrderItemsSummary } from "../components/orders/OrderItemsSummary";
import type { OrderItemSnapshot } from "../types/order.types";

// Paso intermedio del checkout: "revisar el carrito, confirmar, crear la
// orden" (así lo pide la consigna). Acá todavía no existe ninguna orden --
// se crea recién cuando se toca "Confirmar compra". Si se llega acá con el
// carrito vacío (por ejemplo, entrando directo por URL) no hay nada que
// confirmar, así que mandamos de vuelta al carrito.
export const CheckoutConfirmPage = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  // Doble-submit: mientras se crea la orden, el botón queda deshabilitado.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return <Navigate to="/carrito" replace />;
  }

  const handleConfirm = async () => {
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const orderItems: OrderItemSnapshot[] = items.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        priceAtPurchase: product.price,
        quantity,
      }));

      // Creamos la orden en Firestore con un snapshot de los items (nombre y
      // precio "congelados" al momento de la compra) y recién si eso se
      // confirma vaciamos el carrito.
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

  return (
    <section className="max-w-[560px] mx-auto px-6 py-16">
      <h1 className="font-heading font-extrabold text-2xl text-azul-noche mb-6">Confirmar compra</h1>

      <div className="p-5 rounded-card-lg bg-white border border-gris-claro">
        <h2 className="font-heading font-extrabold text-sm text-azul-noche mb-3">Tus productos</h2>
        <OrderItemsSummary items={items.map(({ product, quantity }) => ({
          productId: product.id,
          name: product.name,
          priceAtPurchase: product.price,
          quantity,
        }))} total={total} />
      </div>

      <button
        onClick={handleConfirm}
        disabled={isSubmitting}
        className="w-full mt-6 text-sm font-extrabold text-azul-noche bg-mostaza px-7 py-3.5 rounded-pill shadow-cta disabled:opacity-60"
      >
        {isSubmitting ? "Procesando..." : "Confirmar compra"}
      </button>
      <p className="text-xs text-azul-noche/50 text-center mt-3">
        Es una compra simulada: no se procesa ningún pago real.
      </p>
    </section>
  );
};
