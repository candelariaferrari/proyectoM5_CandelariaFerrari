import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { listUserOrders } from "../services/orders.services";
import { ORDER_STATUS_INFO } from "../constants/orderStatus";
import { ListIcon, ChevronUpIcon } from "../components/ui/icons";
import { OrderItemsSummary } from "../components/orders/OrderItemsSummary";
import type { Order } from "../types/order.types";

export const CustomerOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  // Detalle de cada pedido: expandir/colapsar en la lista, sin ir a otra pantalla.
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    listUserOrders(user.uid)
      .then(setOrders)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <section className="max-w-[1280px] mx-auto px-6 py-16 text-center">
        <p className="text-sm text-azul-noche/60">Cargando tus pedidos...</p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="max-w-[1280px] mx-auto px-6 py-16 text-center">
        <p className="text-sm text-azul-noche/60">No pudimos cargar tus pedidos. Probá de nuevo en un momento.</p>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="max-w-[1280px] mx-auto px-6 py-16 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-card-surface flex items-center justify-center">
          <ListIcon size={26} className="text-azul-noche/40" />
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-azul-noche">Todavía no hiciste ningún pedido</h1>
        <p className="text-sm text-azul-noche/60">Cuando compres algo, lo vas a ver acá.</p>
        <Link
          to="/productos"
          className="text-sm font-extrabold text-azul-noche bg-mostaza px-7 py-3.5 rounded-pill shadow-cta"
        >
          Ver productos
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-8">
      <h1 className="font-heading font-extrabold text-2xl text-azul-noche mb-6">Mis pedidos</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          const statusInfo = ORDER_STATUS_INFO[order.status];

          return (
            <div key={order.id} className="rounded-card bg-white border border-gris-claro overflow-hidden">
              <button
                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                className="w-full flex items-center justify-between gap-4 p-4"
                aria-expanded={isExpanded}
              >
                <div className="text-left min-w-0">
                  <p className="font-bold text-azul-noche truncate">Pedido #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-azul-noche/50">
                    {order.createdAt.toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-bold px-3 py-1 rounded-pill whitespace-nowrap ${statusInfo.badgeClassName}`}>
                    {statusInfo.label}
                  </span>
                  <span className="font-extrabold text-azul-noche">${order.total.toLocaleString("es-AR")}</span>
                  <ChevronUpIcon
                    size={16}
                    className={`text-azul-noche/40 transition-transform ${isExpanded ? "" : "rotate-180"}`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gris-claro pt-3">
                  <OrderItemsSummary items={order.items} total={order.total} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
