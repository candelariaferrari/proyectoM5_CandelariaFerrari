import { Link, Navigate, useLocation } from "react-router-dom";
import { CheckIcon } from "../components/ui/icons";
import type { OrderItemSnapshot } from "../types/order.types";

// Se llega acá solo navegando desde el checkout (CartPage pasa la orden
// recién creada por state). Si alguien entra directo a esta URL -por
// ejemplo, recargando la página- no hay state y mandamos a "Mis pedidos",
// que es donde igual va a estar la orden.
interface OrderConfirmationState {
  orderId: string;
  items: OrderItemSnapshot[];
  total: number;
}

export const OrderConfirmationPage = () => {
  const location = useLocation();
  const state = location.state as OrderConfirmationState | null;

  if (!state) {
    return <Navigate to="/pedidos" replace />;
  }

  const { orderId, items, total } = state;

  return (
    <section className="max-w-[560px] mx-auto px-6 py-16 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-verde-menta/15 flex items-center justify-center">
        <CheckIcon size={28} className="text-verde-menta" />
      </div>

      <h1 className="font-heading font-extrabold text-2xl text-azul-noche">¡Compra realizada!</h1>
      <p className="text-sm text-azul-noche/60">
        Pedido #{orderId.slice(0, 8)} confirmado. Vas a poder seguir su estado en "Mis pedidos".
      </p>

      <div className="w-full flex flex-col gap-2 p-5 rounded-card-lg bg-crema text-left mt-2">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between text-sm">
            <span className="text-azul-noche/80">
              {item.quantity}x {item.name}
            </span>
            <span className="font-bold text-azul-noche">
              ${(item.priceAtPurchase * item.quantity).toLocaleString("es-AR")}
            </span>
          </div>
        ))}

        <div className="h-px bg-azul-noche/10 my-1" />

        <div className="flex items-center justify-between font-extrabold text-azul-noche">
          <span>Total</span>
          <span>${total.toLocaleString("es-AR")}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
        <Link
          to="/pedidos"
          className="flex-1 text-sm font-extrabold text-azul-noche bg-mostaza px-7 py-3.5 rounded-pill shadow-cta"
        >
          Ver mis pedidos
        </Link>
        <Link
          to="/productos"
          className="flex-1 text-sm font-bold text-azul-cobalto px-7 py-3.5 rounded-pill bg-card-surface"
        >
          Seguir comprando
        </Link>
      </div>
    </section>
  );
};
