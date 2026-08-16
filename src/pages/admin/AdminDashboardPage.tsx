import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { countProducts } from "../../services/products.services";
import { getUser } from "../../services/users.services";

export const AdminDashboardPage = () => {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    // Solo mostramos lo que podemos calcular de verdad. Ventas y Órdenes
    // dependen de la colección "orders", que todavía no existe (eso es
    // parte del checkout, L8) — no vamos a inventar esos números.
    countProducts().then(setProductCount); // agregacion del lado del servidor: no hace falta traer los 60 productos solo para contarlos
    getUser().then((users) => setUserCount(users.length));
  }, []);

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-azul-noche">Dashboard</h1>
        <Link
          to="/admin/productos"
          state={{ openCreate: true }}
          className="text-sm font-extrabold text-azul-noche bg-mostaza px-5 py-2.5 rounded-pill shadow-cta"
        >
          + Nuevo producto
        </Link>
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
      </div>

      <div className="p-6 rounded-card-lg bg-white border border-gris-claro text-center">
        <p className="font-bold text-azul-noche">Todavía no hay pedidos</p>
        <p className="text-sm text-azul-noche/50 mt-1">
          Las ventas y las órdenes van a aparecer acá cuando armemos el checkout.
        </p>
      </div>
    </section>
  );
};
