import { Link, Navigate, useLocation } from "react-router-dom";
import { CheckIcon } from "../components/ui/icons";
import { Button } from "../components/ui/Button";
import { OrderItemsSummary } from "../components/orders/OrderItemsSummary";
import type { OrderItemSnapshot } from "../types/order.types";

// Se llega acá solo navegando desde el checkout (CartPage pasa la orden
// recién creada por state)
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

      <div className="w-full p-5 rounded-card-lg bg-crema text-left mt-2">
        <OrderItemsSummary items={items} total={total} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
        <Button variant="link" to="/pedidos" className="flex-1">
          Ver mis pedidos
        </Button>
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
