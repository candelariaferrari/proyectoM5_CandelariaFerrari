import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { HomeIcon, ListIcon, type IconComponent } from "../ui/icons";
import { MundoLogo } from "../ui/MundoLogo";

// Layout propio del panel de admin: nav distinto al del sitio de cliente
// (Header/BottomTabBar), porque esta es una sección aparte con su propia
// navegación y no tiene sentido mezclarla con el buscador, el carrito, etc.
// Un solo array de items alimenta el nav de desktop Y el tab bar de mobile,
// para no repetir cada link a mano en los dos lugares.
const ADMIN_NAV_ITEMS: { to: string; label: string; icon: IconComponent; end: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: HomeIcon, end: true },
  { to: "/admin/productos", label: "Productos", icon: ListIcon, end: false },
  { to: "/admin/ordenes", label: "Órdenes", icon: ListIcon, end: false },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const initials = (user?.displayName ?? user?.email ?? "AD").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Desktop: mismos márgenes que el Header de cliente (max-w-1280 + px-6),
          para que el contenido quede alineado igual en las dos secciones. */}
      <header className="hidden md:block bg-white">
        <div className="flex items-center justify-between gap-4 px-6 py-4 max-w-[1280px] mx-auto border-b border-gris-claro">
          <div className="flex items-end gap-2">
            <MundoLogo lettersClassName="text-3xl" taglineClassName="text-[10px]" />
            <span className="text-xs font-extrabold tracking-widest text-azul-noche/40 mb-1">ADMIN</span>
          </div>

          <nav className="flex items-center gap-2">
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `text-sm font-bold px-4 py-2 rounded-pill ${
                    isActive ? "bg-azul-cobalto/10 text-azul-cobalto" : "text-azul-noche/60"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
             {/* Salida a propósito del panel de admin, para ver la tienda
                como la ve un customer -- no es parte de ADMIN_NAV_ITEMS
                porque no es una página del panel, es salir de él. */}
            <NavLink to="/" className="text-sm font-bold text-azul-noche/60 px-4 py-2 rounded-pill hover:bg-card-surface">
              Ver tienda
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
           
          {/*   <div className="w-9 h-9 rounded-full bg-mostaza text-white font-extrabold text-sm flex items-center justify-center">
              {initials} 
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-azul-noche">{user?.displayName ?? "Admin"}</p>
              <p className="text-xs text-azul-noche/50">Rol: {user?.role}</p>
            </div> */}
            <button onClick={logout} className="text-sm font-bold text-danger bg-stock-low px-4 py-2 rounded-pill">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Mobile: mismos márgenes que el Header de cliente (px-6), wordmark
          completo con tagline igual que del lado cliente. */}
      <header className="md:hidden bg-white border-b border-gris-claro">
        <div className="flex items-end justify-between gap-2 px-6 py-3">
          <div className="flex items-end gap-2">
            <MundoLogo lettersClassName="text-xl" taglineClassName="text-[9px]" showTagline />
            <span className="text-[10px] font-extrabold tracking-widest text-azul-noche/40 mb-0.5">ADMIN</span>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <Link to="/" className="text-xs font-bold text-azul-noche/60">
              Ver tienda
            </Link>
            <button onClick={logout} className="text-xs font-bold text-danger">
              Salir
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gris-claro flex items-stretch justify-around z-40">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 flex-1 text-[11px] font-bold ${
                  isActive ? "text-azul-cobalto" : "text-azul-noche/50"
                }`
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
