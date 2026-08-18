import { useEffect, useState } from "react";
import { countProducts } from "../../services/products.services";
import { getUser } from "../../services/users.services";
import { listAllOrders } from "../../services/orders.services";
import { Button } from "../../components/ui/Button";
import { formatCurrency } from "../../utils/format";

export const AdminDashboardPage = () => {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [totalSales, setTotalSales] = useState<number | null>(null);

  useEffect(() => {
    countProducts().then(setProductCount); // agregacion del lado del servidor: no hace falta traer los 60 productos solo para contarlos
    getUser()
      .then((users) => setUserCount(users.length))
      .catch(() => setUserCount(null));
    listAllOrders()
      .then((orders) => {
        setOrderCount(orders.length);
        // Una orden cancelada no es una venta real: no la contamos.
        const sales = orders
          .filter((order) => order.status !== "cancelled")
          .reduce((sum, order) => sum + order.total, 0);
        setTotalSales(sales);
      })
      .catch(() => setOrderCount(null));
  }, []);

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-azul-noche">Dashboard</h1>
        <Button variant="link" to="/admin/productos" state={{ openCreate: true }} size="sm">
          + Nuevo producto
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-card-lg bg-white border border-gris-claro">
          <p className="text-sm text-azul-noche/50">Productos</p>
          <p className="font-heading font-extrabold text-3xl text-azul-noche mt-1">
            {productCount ?? "…"}
          </p>
        </div>
        <div className="p-5 rounded-card-lg bg-white border border-gris-claro">
          <p className="text-sm text-azul-noche/50">Usuarios</p>
          <p className="font-heading font-extrabold text-3xl text-azul-noche mt-1">{userCount ?? "…"}</p>
        </div>
        <div className="p-5 rounded-card-lg bg-white border border-gris-claro">
          <p className="text-sm text-azul-noche/50">Órdenes</p>
          <p className="font-heading font-extrabold text-3xl text-azul-noche mt-1">{orderCount ?? "…"}</p>
        </div>
        <div className="p-5 rounded-card-lg bg-white border border-gris-claro">
          <p className="text-sm text-azul-noche/50">Ventas</p>
          <p className="font-heading font-extrabold text-3xl text-azul-noche mt-1">
            {totalSales === null ? "…" : formatCurrency(totalSales)}
          </p>
        </div>
      </div>
    </section>
  );
};
