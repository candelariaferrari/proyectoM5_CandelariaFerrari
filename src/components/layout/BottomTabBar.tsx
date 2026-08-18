import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { AuthModal } from "../auth/AuthModal";
import { HomeIcon, GridIcon, CartIcon, ListIcon, UserIcon } from "../ui/icons";

export const BottomTabBar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const isHome = location.pathname === "/";
  const isProducts = location.pathname.startsWith("/productos") || location.pathname.startsWith("/producto/");
  const isCart = location.pathname === "/carrito";
  const isOrders = location.pathname === "/pedidos";

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setIsProfileOpen((open) => !open);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gris-borde flex items-stretch justify-around z-40">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 py-2.5 flex-1 text-[11px] font-bold ${
            isHome ? "text-azul-cobalto" : "text-azul-noche/50"
          }`}
        >
          <HomeIcon size={20} />
          Inicio
        </Link>

        <Link
          to="/productos"
          className={`flex flex-col items-center gap-0.5 py-2.5 flex-1 text-[11px] font-bold ${
            isProducts ? "text-azul-cobalto" : "text-azul-noche/50"
          }`}
        >
          <GridIcon size={20} />
          Juguetes
        </Link>

        <Link
          to="/carrito"
          className={`relative flex flex-col items-center gap-0.5 py-2.5 flex-1 text-[11px] font-bold ${
            isCart ? "text-azul-cobalto" : "text-azul-noche/50"
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
          className={`flex flex-col items-center gap-0.5 py-2.5 flex-1 text-[11px] font-bold ${
            isOrders ? "text-azul-cobalto" : "text-azul-noche/50"
          }`}
        >
          <ListIcon size={20} />
          Pedidos
        </Link>

        <button
          onClick={handleProfileClick}
          className="flex flex-col items-center gap-0.5 py-2.5 flex-1 text-[11px] font-bold text-azul-noche/50"
        >
          <UserIcon size={20} />
          Perfil
        </button>
      </nav>

      {isProfileOpen && (
        <div className="md:hidden fixed bottom-[52px] inset-x-0 bg-white border-t border-gris-borde px-6 py-4 flex items-center justify-between z-40">
          <span className="text-sm text-azul-noche/70">
            Hola{user?.displayName ? `, ${user.displayName}` : ""}
          </span>
          <button
            onClick={() => {
              logout();
              setIsProfileOpen(false);
            }}
            className="text-sm font-bold text-danger px-3 py-2 rounded-pill"
          >
            Cerrar sesión
          </button>
        </div>
      )}

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </>
  );
};
