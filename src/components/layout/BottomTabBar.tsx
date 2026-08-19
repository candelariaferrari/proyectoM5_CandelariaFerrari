import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { AuthModal } from "../auth/AuthModal";
import { HomeIcon, GridIcon, CartIcon, ListIcon, UserIcon } from "../ui/icons";
import { LogoutButton } from "../ui/LogoutButton";
//contenedor
export const BottomTabBar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { items } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const isHome = location.pathname === "/";
  const isProducts = location.pathname.startsWith("/productos") || location.pathname.startsWith("/producto/");
  const isCart = location.pathname === "/carrito";
  const isOrders = location.pathname === "/pedidos";

  return (
    <>
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gris-borde flex items-stretch justify-around z-40">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 py-2.5 flex-1 text-[11px] font-bold transition-colors hover:bg-card-surface ${isHome ? "text-azul-cobalto" : "text-azul-noche/50"
            }`}
        >
          <HomeIcon size={20} />
          Inicio
        </Link>

        <Link
          to="/productos"
          className={`flex flex-col items-center gap-0.5 py-2.5 flex-1 text-[11px] font-bold transition-colors hover:bg-card-surface ${isProducts ? "text-azul-cobalto" : "text-azul-noche/50"
            }`}
        >
          <GridIcon size={20} />
          Juguetes
        </Link>

        <Link
          to="/carrito"
          className={`relative flex flex-col items-center gap-0.5 py-2.5 flex-1 text-[11px] font-bold transition-colors hover:bg-card-surface ${isCart ? "text-azul-cobalto" : "text-azul-noche/50"
            }`}
        >
          <CartIcon size={20} />
          {cartCount > 0 && (
            <span className="absolute top-1 right-[calc(50%-18px)] bg-rosa-coral text-white text-[9px] font-extrabold min-w-[15px] h-[15px] rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          Carrito
        </Link>

        <Link
          to="/pedidos"
          className={`flex flex-col items-center gap-0.5 py-2.5 flex-1 text-[11px] font-bold transition-colors hover:bg-card-surface ${isOrders ? "text-azul-cobalto" : "text-azul-noche/50"
            }`}
        >
          <ListIcon size={20} />
          Pedidos
        </Link>

        <div className="flex flex-col items-center justify-center py-2.5 flex-1">
          {isAuthenticated ? (
            <LogoutButton />
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-9 h-9 rounded-full bg-card-surface flex items-center justify-center transition-shadow hover:ring-2 hover:ring-inset hover:ring-gris-borde"
              aria-label="Iniciar sesión"
            >
              <UserIcon className="text-azul-noche" />
            </button>
          )}
        </div>
      </nav>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </>
  );
};
