import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { countProducts, listLowStockProducts } from "../../services/products.services";
import { countUsers, getUser } from "../../services/users.services";
import { listAllOrders } from "../../services/orders.services";
import { ORDER_STATUS_INFO } from "../../constants/orderStatus";
import { Button } from "../../components/ui/Button";
import { formatCurrency } from "../../utils/format";
import type { Order } from "../../types/order.types";
import type { Product } from "../../types/product.types";

// Cuántas filas mostrar en cada card del dashboard: son un adelanto, no el
// listado completo (para eso está "Órdenes" y "Productos" en el nav).
const RECENT_ORDERS_LIMIT = 5;
const LOW_STOCK_LIMIT = 5;

type CustomerInfo = { email: string; displayName?: string };

const formatOrderDate = (date: Date) =>
  date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }) +
  " " +
  date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

const StatusBadge = ({ status }: { status: Order["status"] }) => {
  const info = ORDER_STATUS_INFO[status];
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-pill whitespace-nowrap ${info.badgeClassName}`}>
      {info.label}
    </span>
  );
};

export const AdminDashboardPage = () => {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [totalSales, setTotalSales] = useState<number | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [customersById, setCustomersById] = useState<Record<string, CustomerInfo>>({});
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    countProducts().then(setProductCount); // agregacion del lado del servidor: no hace falta traer los 60 productos solo para contarlos
    countUsers()
      .then(setUserCount)
      .catch(() => setUserCount(null));
    listAllOrders()
      .then((orders) => {
        setOrderCount(orders.length);
        // Una orden cancelada no es una venta real: no la contamos.
        const sales = orders
          .filter((order) => order.status !== "cancelled")
          .reduce((sum, order) => sum + order.total, 0);
        setTotalSales(sales);
        // listAllOrders ya viene ordenada por createdAt desc: las primeras
        // N son directamente las más recientes, sin ordenar de nuevo acá.
        setRecentOrders(orders.slice(0, RECENT_ORDERS_LIMIT));
      })
      .catch(() => setOrderCount(null));
    // Mismo patrón que AdminOrdersPage para mostrar nombre/email en vez del
    // uid: si falla, nos quedamos mostrando el uid, no es crítico.
    getUser()
      .then((allUsers) => {
        setCustomersById(
          Object.fromEntries(allUsers.map((u) => [u.uid, { email: u.email, displayName: u.displayName }]))
        );
      })
      .catch(() => {
        /* best-effort */
      });
    listLowStockProducts(LOW_STOCK_LIMIT)
      .then(setLowStockProducts)
      .catch(() => setLowStockProducts([]));
  }, []);

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-azul-noche">Dashboard</h1>
        <Button variant="link" to="/admin/productos" state={{ openCreate: true }} size="sm">
          + Nuevo Producto
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-card-lg bg-white border border-gris-borde">
          <p className="text-sm text-azul-noche/50">Productos</p>
          <p className="font-heading font-extrabold text-3xl text-azul-noche mt-1">
            {productCount ?? "…"}
          </p>
        </div>
        <div className="p-5 rounded-card-lg bg-white border border-gris-borde">
          <p className="text-sm text-azul-noche/50">Usuarios</p>
          <p className="font-heading font-extrabold text-3xl text-azul-noche mt-1">{userCount ?? "…"}</p>
        </div>
        <div className="p-5 rounded-card-lg bg-white border border-gris-borde">
          <p className="text-sm text-azul-noche/50">Órdenes</p>
          <p className="font-heading font-extrabold text-3xl text-azul-noche mt-1">{orderCount ?? "…"}</p>
        </div>
        <div className="p-5 rounded-card-lg bg-white border border-gris-borde">
          <p className="text-sm text-azul-noche/50">Ventas</p>
          <p className="font-heading font-extrabold text-3xl text-azul-noche mt-1">
            {totalSales === null ? "…" : formatCurrency(totalSales)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
        <div className="p-5 rounded-card-lg bg-white border border-gris-borde">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-extrabold text-lg text-azul-noche">Órdenes recientes</h2>
            <Link to="/admin/ordenes" className="text-sm font-bold text-azul-cobalto shrink-0">
              Ver todas
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-azul-noche/50 py-4 text-center">Todavía no hay órdenes.</p>
          ) : (
            <>
              {/* Desktop: tabla, igual criterio que AdminOrdersPage */}
              <table className="hidden md:table w-full">
                <thead>
                  <tr className="text-left text-xs font-bold text-azul-noche/40 uppercase">
                    <th className="pb-2 font-bold">ID</th>
                    <th className="pb-2 font-bold">Cliente</th>
                    <th className="pb-2 font-bold">Fecha</th>
                    <th className="pb-2 font-bold">Total</th>
                    <th className="pb-2 font-bold text-right">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const customer = customersById[order.userId];
                    return (
                      <tr key={order.id} className="border-t border-gris-borde">
                        <td className="py-3 font-bold text-azul-noche">#{order.id.slice(0, 8)}</td>
                        <td className="py-3 text-sm text-azul-noche/70">
                          {customer?.displayName ?? customer?.email ?? order.userId}
                        </td>
                        <td className="py-3 text-sm text-azul-noche/70">{formatOrderDate(order.createdAt)}</td>
                        <td className="py-3 text-sm font-bold text-azul-noche">{formatCurrency(order.total)}</td>
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

              {/* Mobile: tarjetas, mismo dato que la tabla pero apiladas */}
              <div className="md:hidden flex flex-col gap-3">
                {recentOrders.map((order) => {
                  const customer = customersById[order.userId];
                  return (
                    <div key={order.id} className="flex items-center justify-between gap-3 py-2 border-t border-gris-borde first:border-t-0">
                      <div>
                        <p className="text-sm font-bold text-azul-noche">#{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-azul-noche/50">
                          {customer?.displayName ?? customer?.email ?? order.userId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-azul-noche">{formatCurrency(order.total)}</p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="p-5 rounded-card-lg bg-white border border-gris-borde">
          <h2 className="font-heading font-extrabold text-lg text-azul-noche mb-4">Stock a revisar</h2>

          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-azul-noche/50 py-4 text-center">Ningún producto con poco stock. 🎉</p>
          ) : (
            <div className="flex flex-col gap-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-azul-noche">{product.name}</p>
                    <p className="text-xs text-danger font-bold">Stock: {product.stock}</p>
                  </div>
                  <Link
                    to="/admin/productos"
                    state={{ editProduct: product }}
                    className="text-xs font-bold text-azul-noche/70 bg-card-surface px-4 py-2 rounded-pill shrink-0 hover:bg-gris-claro"
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
