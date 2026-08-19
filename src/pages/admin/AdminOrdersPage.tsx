import { useEffect, useState } from "react";
import { useOrders } from "../../hooks/useOrders";
import { getUser } from "../../services/users.services";
import { ORDER_STATUS_INFO, ORDER_STATUS_IDS, ORDER_STATUS_TRANSITIONS } from "../../constants/orderStatus";
import { OrderItemsSummary } from "../../components/orders/OrderItemsSummary";
import { formatCurrency } from "../../utils/format";
import { useToast } from "../../hooks/useToast";
import { ListIcon, ChevronUpIcon } from "../../components/ui/icons";
import { Skeleton } from "../../components/ui/Skeleton";
import { Pagination } from "../../components/ui/Pagination";
import type { Order, OrderStatus } from "../../types/order.types";

type CustomerInfo = { email: string; displayName?: string };

// Mismo PAGE_SIZE que usan las páginas de productos (AdminProductsPage,
// ProductsPage) -- acá no hace falta pedirle a Firestore de a páginas (ver
// comentario de `useOrders` más abajo: el contexto ya trae TODAS las
// órdenes), así que paginamos en memoria con un slice simple.
const PAGE_SIZE = 10;

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const info = ORDER_STATUS_INFO[status];
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-pill whitespace-nowrap ${info.badgeClassName}`}>
      {info.label}
    </span>
  );
};

const formatOrderDate = (date: Date) =>
  date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }) +
  " " +
  date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

// Botonera "Cambiar estado": el estado actual queda resaltado (no se puede
// re-clickear), las transiciones válidas desde ahí quedan clickeables, y el
// resto queda deshabilitado -- misma máquina de estados que ya usábamos en
// el <select> anterior (ver ORDER_STATUS_TRANSITIONS), solo que ahora como
// botones para calcar el mockup.
const ChangeStatusButtons = ({
  order,
  disabled,
  onChange,
}: {
  order: Order;
  disabled: boolean;
  onChange: (status: OrderStatus) => void;
}) => {
  const validTargets = ORDER_STATUS_TRANSITIONS[order.status];

  return (
    <div className="flex flex-wrap gap-2">
      {ORDER_STATUS_IDS.map((status) => {
        const isCurrent = status === order.status;
        const isValidTarget = validTargets.includes(status);
        const info = ORDER_STATUS_INFO[status];

        return (
          <button
            key={status}
            disabled={isCurrent || !isValidTarget || disabled}
            onClick={() => onChange(status)}
            className={`text-sm font-bold px-4 py-2 rounded-pill ${info.badgeClassName} ${
              isCurrent
                ? "ring-2 ring-offset-1 ring-azul-cobalto"
                : isValidTarget
                  ? "cursor-pointer transition-opacity hover:opacity-80"
                  : "opacity-30 cursor-not-allowed"
            }`}
          >
            {info.label}
          </button>
        );
      })}
    </div>
  );
};

const OrderDetailPanel = ({
  order,
  customer,
  updatingId,
  onStatusChange,
}: {
  order: Order;
  customer: CustomerInfo | undefined;
  updatingId: string | null;
  onStatusChange: (order: Order, status: OrderStatus) => void;
}) => (
  <div className="flex flex-col gap-5 p-5 rounded-card-lg bg-white border border-gris-borde">
    <div>
      <p className="text-xs font-bold text-azul-noche/40 uppercase">Orden #{order.id.slice(0, 8)}</p>
      <p className="font-heading font-extrabold text-lg text-azul-noche mt-1">
        {customer?.displayName ?? customer?.email ?? order.userId}
      </p>
      {customer?.displayName && <p className="text-sm text-azul-noche/60">{customer.email}</p>}
      <p className="text-sm text-azul-noche/50">{formatOrderDate(order.createdAt)}</p>
    </div>

    <div>
      <h3 className="font-heading font-extrabold text-sm text-azul-noche mb-2">Cambiar estado</h3>
      <ChangeStatusButtons
        order={order}
        disabled={updatingId === order.id}
        onChange={(status) => onStatusChange(order, status)}
      />
    </div>

    <div className="h-px bg-azul-noche/10" />

    <div>
      <h3 className="font-heading font-extrabold text-sm text-azul-noche mb-2">Productos</h3>
      <OrderItemsSummary items={order.items} total={order.total} />
    </div>
  </div>
);

export const AdminOrdersPage = () => {
  const { showToast } = useToast();
  // orders/loading/updateOrderStatus ya no se piden acá: vienen del
  // contexto (OrdersContext ya sabe que este usuario es admin, así que
  // `orders` viene con TODAS las órdenes). Esta página solo se encarga de
  // filtrar/seleccionar/mostrar, no de ir a buscar datos.
  const { orders, loading, error, updateOrderStatus } = useOrders();
  const [customersById, setCustomersById] = useState<Record<string, CustomerInfo>>({});
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // La lista de clientes (email/nombre por uid) sigue siendo un pedido
  // aparte: es información de usuarios, no de órdenes, así que no le
  // corresponde a OrdersContext -- mismo criterio de "cada contexto un
  // dominio" que separa Cart de Products.
  useEffect(() => {
    getUser()
      .then((allUsers) => {
        setCustomersById(
          Object.fromEntries(allUsers.map((u) => [u.uid, { email: u.email, displayName: u.displayName }]))
        );
      })
      .catch(() => {
        /* best-effort: si falla, mostramos el uid en vez del email/nombre */
      });
  }, []);

  // El contexto avisa por su `error` si falló la carga de órdenes -- acá
  // lo convertimos en el mismo toast que ya mostraba esta página antes.
  useEffect(() => {
    if (error) showToast("No pudimos cargar las órdenes.", "danger");
  }, [error, showToast]);

  const handleStatusChange = async (order: Order, status: OrderStatus) => {
    setUpdatingId(order.id);
    try {
      await updateOrderStatus(order.id, status);
      showToast(`Pedido #${order.id.slice(0, 8)} ahora está "${ORDER_STATUS_INFO[status].label}"`);
    } catch {
      showToast("No pudimos actualizar el estado. Probá de nuevo.", "danger");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFilterChange = (status: OrderStatus | null) => {
    setStatusFilter(status);
    setCurrentPage(1);
    const nextOrders = status ? orders.filter((o) => o.status === status) : orders;
    setSelectedOrderId(nextOrders[0]?.id ?? null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedOrderId(filteredOrders[(page - 1) * PAGE_SIZE]?.id ?? null);
  };

  const filteredOrders = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  const safePage = Math.min(currentPage, totalPages);
  const pagedOrders = filteredOrders.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const selectedOrder = pagedOrders.find((o) => o.id === selectedOrderId) ?? pagedOrders[0] ?? null;

  if (loading) {
    return (
      <section className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-4 p-4 rounded-card bg-white shadow-card">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-pill" />
              </div>
            ))}
          </div>
          <div className="hidden lg:flex flex-col gap-4 p-5 rounded-card-lg bg-white border border-gris-borde">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-9 w-full rounded-pill" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="max-w-[1280px] mx-auto px-6 py-16 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-card-surface flex items-center justify-center">
          <ListIcon size={26} className="text-azul-noche/40" />
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-azul-noche">No hay órdenes todavía</h1>
        <p className="text-sm text-azul-noche/60">Cuando haya pedidos, los vas a poder gestionar acá.</p>
      </section>
    );
  }

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-azul-noche">Órdenes</h1>
        <span className="text-xs text-azul-noche/50">{filteredOrders.length} pedido(s)</span>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-5">
        <button
          onClick={() => handleFilterChange(null)}
          className={`text-sm font-bold px-4 py-2 rounded-pill shrink-0 transition-shadow hover:ring-2 hover:ring-inset ${
            statusFilter === null
              ? "bg-azul-cobalto text-white hover:ring-white/50"
              : "bg-card-surface text-azul-noche/70 hover:ring-gris-borde"
          }`}
        >
          Todas
        </button>
        {ORDER_STATUS_IDS.map((status) => (
          <button
            key={status}
            onClick={() => handleFilterChange(status)}
            className={`text-sm font-bold px-4 py-2 rounded-pill shrink-0 transition-shadow hover:ring-2 hover:ring-inset ${
              statusFilter === status
                ? "bg-azul-cobalto text-white hover:ring-white/50"
                : "bg-card-surface text-azul-noche/70 hover:ring-gris-borde"
            }`}
          >
            {ORDER_STATUS_INFO[status].label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-sm text-azul-noche/50 text-center py-8">No hay órdenes con este estado.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] items-start">
          {/* Lista: tabla en desktop, tarjetas en mobile */}
          <div>
            <table className="hidden lg:table w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-azul-noche/40 uppercase">
                  <th className="pb-3 font-bold">ID</th>
                  <th className="pb-3 font-bold">Cliente</th>
                  <th className="pb-3 font-bold">Fecha</th>
                  <th className="pb-3 font-bold">Total</th>
                  <th className="pb-3 font-bold text-right">Estado</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((order) => {
                  const customer = customersById[order.userId];
                  const isSelected = order.id === selectedOrderId;
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`border-t border-gris-borde cursor-pointer ${isSelected ? "bg-crema" : ""}`}
                    >
                      <td className="py-3 font-bold text-azul-noche">#{order.id.slice(0, 8)}</td>
                      <td className="py-3 text-sm text-azul-noche/70">
                        {customer?.displayName ?? customer?.email ?? order.userId}
                      </td>
                      <td className="py-3 text-sm text-azul-noche/70">
                        {order.createdAt.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}{" "}
                        {order.createdAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3 text-sm font-bold text-azul-noche">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end">
                          <StatusBadge status={order.status} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile: cada tarjeta se puede tocar para ver el detalle debajo (mismo patrón que "Mis pedidos") */}
            <div className="lg:hidden flex flex-col gap-3">
              {pagedOrders.map((order) => {
                const customer = customersById[order.userId];
                const isSelected = order.id === selectedOrderId;
                return (
                  <div key={order.id}>
                    <button
                      onClick={() => setSelectedOrderId(isSelected ? null : order.id)}
                      className="w-full flex flex-col gap-2 p-4 rounded-card bg-white shadow-card text-left transition-colors hover:bg-card-surface"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-azul-noche">#{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-azul-noche/50">
                            {customer?.displayName ?? customer?.email ?? order.userId}
                          </p>
                        </div>
                        <p className="font-extrabold text-azul-noche shrink-0">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-azul-noche/50">
                          {order.createdAt.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}
                        </span>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={order.status} />
                          <ChevronUpIcon
                            size={16}
                            className={`text-azul-noche/40 transition-transform ${isSelected ? "" : "rotate-180"}`}
                        />
                      </div>
                    </div>
                    </button>

                    {isSelected && (
                      <div className="mt-2">
                        <OrderDetailPanel
                          order={order}
                          customer={customer}
                          updatingId={updatingId}
                          onStatusChange={handleStatusChange}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>

          {/* Desktop: panel de detalle fijo al costado */}
          <div className="hidden lg:block sticky top-6">
            {selectedOrder ? (
              <OrderDetailPanel
                order={selectedOrder}
                customer={customersById[selectedOrder.userId]}
                updatingId={updatingId}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <p className="text-sm text-azul-noche/50 text-center py-8">Seleccioná una orden para ver el detalle.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
