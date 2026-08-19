import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { ORDER_STATUS_INFO } from "../constants/orderStatus";
import { ListIcon, ChevronUpIcon } from "../components/ui/icons";
import { OrderItemsSummary } from "../components/orders/OrderItemsSummary";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Pagination } from "../components/ui/Pagination";
import { formatCurrency } from "../utils/format";

const PAGE_SIZE = 10;

export const CustomerOrdersPage = () => {

  const { orders, loading, error: loadError } = useOrders();
  // Detalle de cada pedido: expandir/colapsar en la lista, sin ir a otra pantalla.
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedOrders = orders.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (loading) {
    return (
      <section className="max-w-[1280px] mx-auto px-6 py-8">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between gap-4 p-4 rounded-card bg-white border border-gris-borde">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Skeleton className="h-6 w-20 rounded-pill" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
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
        <Button variant="link" to="/productos">Ver productos</Button>
      </section>
    );
  }

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-8">
      <h1 className="font-heading font-extrabold text-2xl text-azul-noche mb-6">Mis pedidos</h1>

      <div className="flex flex-col gap-4">
        {pagedOrders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          const statusInfo = ORDER_STATUS_INFO[order.status];

          return (
            <div key={order.id} className="rounded-card bg-white border border-gris-borde overflow-hidden">
              <button
                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                className="w-full flex items-center justify-between gap-4 p-4 transition-colors hover:bg-card-surface"
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
                  <span className="font-extrabold text-azul-noche">{formatCurrency(order.total)}</span>
                  <ChevronUpIcon
                    size={16}
                    className={`text-azul-noche/40 transition-transform ${isExpanded ? "" : "rotate-180"}`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gris-borde pt-3">
                  <OrderItemsSummary items={order.items} total={order.total} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </section>
  );
};
