import { useEffect, useState } from "react";
import { listAllOrders, updateOrderStatus } from "../../services/orders.services";
import { getUser } from "../../services/users.services";
import { ORDER_STATUS_INFO, ORDER_STATUS_IDS, ORDER_STATUS_TRANSITIONS } from "../../constants/orderStatus";
import { useToast } from "../../hooks/useToast";
import { ListIcon } from "../../components/ui/icons";
import type { Order, OrderStatus } from "../../types/order.types";

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const info = ORDER_STATUS_INFO[status];
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-pill whitespace-nowrap ${info.badgeClassName}`}>
      {info.label}
    </span>
  );
};

// Selector de estado: solo ofrece las transiciones válidas (ver ORDER_STATUS_TRANSITIONS) además del estado actual mismo.
const StatusSelect = ({
  order,
  disabled,
  onChange,
}: {
  order: Order;
  disabled: boolean;
  onChange: (status: OrderStatus) => void;
}) => {
  const nextOptions = ORDER_STATUS_TRANSITIONS[order.status];

  if (nextOptions.length === 0) {
    return <StatusBadge status={order.status} />;
  }

  return (
    <select
      value={order.status}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      className="text-xs font-bold px-3 py-1.5 rounded-pill bg-card-surface text-azul-noche disabled:opacity-40"
    >
      <option value={order.status}>{ORDER_STATUS_INFO[order.status].label}</option>
      {nextOptions.map((status) => (
        <option key={status} value={status}>
          {ORDER_STATUS_INFO[status].label}
        </option>
      ))}
    </select>
  );
};

export const AdminOrdersPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [usersById, setUsersById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    // Las dos cargas van independientes: si falla el listado de usuarios
    // (por ejemplo por permisos) no queremos que eso tire abajo también
    // las órdenes -- en el peor caso, mostramos el uid en vez del email.
    listAllOrders()
      .then(setOrders)
      .catch(() => showToast("No pudimos cargar las órdenes.", "danger"))
      .finally(() => setLoading(false));

    getUser()
      .then((allUsers) => setUsersById(Object.fromEntries(allUsers.map((u) => [u.uid, u.email]))))
      .catch(() => {
        /* best-effort: si falla, el email queda como uid en la tabla */
      });
  }, []);

  const handleStatusChange = async (order: Order, status: OrderStatus) => {
    setUpdatingId(order.id);
    try {
      await updateOrderStatus(order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
      showToast(`Pedido #${order.id.slice(0, 8)} ahora está "${ORDER_STATUS_INFO[status].label}"`);
    } catch {
      showToast("No pudimos actualizar el estado. Probá de nuevo.", "danger");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;

  if (loading) {
    return (
      <section className="max-w-[1280px] mx-auto px-6 py-16 text-center">
        <p className="text-sm text-azul-noche/60">Cargando órdenes...</p>
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
          onClick={() => setStatusFilter(null)}
          className={`text-sm font-bold px-4 py-2 rounded-pill shrink-0 ${
            statusFilter === null ? "bg-azul-cobalto text-white" : "bg-card-surface text-azul-noche/70"
          }`}
        >
          Todas
        </button>
        {ORDER_STATUS_IDS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`text-sm font-bold px-4 py-2 rounded-pill shrink-0 ${
              statusFilter === status ? "bg-azul-cobalto text-white" : "bg-card-surface text-azul-noche/70"
            }`}
          >
            {ORDER_STATUS_INFO[status].label}
          </button>
        ))}
      </div>

      {/* Desktop: tabla real, como en Productos */}
      <table className="hidden md:table w-full">
        <thead>
          <tr className="text-left text-xs font-bold text-azul-noche/40 uppercase">
            <th className="pb-3 font-bold">Pedido</th>
            <th className="pb-3 font-bold">Cliente</th>
            <th className="pb-3 font-bold">Fecha</th>
            <th className="pb-3 font-bold">Total</th>
            <th className="pb-3 font-bold text-right">Estado</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id} className="border-t border-gris-claro">
              <td className="py-3 font-bold text-azul-noche">#{order.id.slice(0, 8)}</td>
              <td className="py-3 text-sm text-azul-noche/70">{usersById[order.userId] ?? order.userId}</td>
              <td className="py-3 text-sm text-azul-noche/70">
                {order.createdAt.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })}
              </td>
              <td className="py-3 text-sm font-bold text-azul-noche">${order.total.toLocaleString("es-AR")}</td>
              <td className="py-3">
                <div className="flex justify-end">
                  <StatusSelect
                    order={order}
                    disabled={updatingId === order.id}
                    onChange={(status) => handleStatusChange(order, status)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="flex flex-col gap-2 p-4 rounded-card bg-white shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-azul-noche">#{order.id.slice(0, 8)}</p>
                <p className="text-xs text-azul-noche/50">{usersById[order.userId] ?? order.userId}</p>
              </div>
              <p className="font-extrabold text-azul-noche shrink-0">${order.total.toLocaleString("es-AR")}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-azul-noche/50">
                {order.createdAt.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })}
              </span>
              <StatusSelect
                order={order}
                disabled={updatingId === order.id}
                onChange={(status) => handleStatusChange(order, status)}
              />
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-sm text-azul-noche/50 text-center py-8">No hay órdenes con este estado.</p>
      )}
    </section>
  );
};
