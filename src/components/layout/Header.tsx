import { useCallback, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import { AuthModal } from "../auth/AuthModal";
import { SearchInput } from "../ui/SearchInput";
import { UserIcon, CartIcon, SearchIcon } from "../ui/icons";
import { LogoutButton } from "../ui/LogoutButton";
import { MundoLogo } from "../ui/MundoLogo";

export const Header = () => {
  const { user, isAuthenticated } = useAuth();
  const { items } = useCart();
  const { setSearchTerm } = useProducts();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const navigate = useNavigate();

  // Buscar desde cualquier página te lleva al catálogo, que es el único
  // lugar que renderiza los resultados.
  // useCallback con referencia estable: si no, SearchInput recibe una
  // función nueva en cada render y su debounce se reinicia solo, lo que
  // termina disparando este navigate de nuevo más tarde (por ej. pisando
  // la navegación al detalle de un producto justo después de clickearlo).
  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      if (term) navigate("/productos");
    },
    [setSearchTerm, navigate],
  );

  return (
    <header>
      <div className="bg-verde-menta text-white text-center py-2 text-xs font-bold px-4">
        Envíos gratis en compras mayores a $50.000
      </div>

      <div className="flex items-center justify-between gap-4 px-6 py-4 max-w-[1280px] mx-auto border-b border-gris-borde">
        <Link to="/">
          <MundoLogo />
        </Link>

        {/* A partir de md: todo el header completo, en una sola fila */}
        <nav className="hidden md:flex items-center gap-5">
          <NavLink to="/productos"  className={({ isActive }) =>
                  `text-sm font-bold px-4 py-2 rounded-pill hover:bg-card-surface ${
                    isActive ? "bg-azul-cobalto/10 text-azul-cobalto" : "text-azul-noche/60"
                  }`
                }>
            Juguetes
          </NavLink>

          <NavLink to="/pedidos"  className={({ isActive }) =>
                  `text-sm font-bold px-4 py-2 rounded-pill hover:bg-card-surface ${
                    isActive ? "bg-azul-cobalto/10 text-azul-cobalto" : "text-azul-noche/60"
                  }`
                }>
            Mis pedidos
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin"  className={({ isActive }) =>
                  `text-sm font-bold px-4 py-2 rounded-pill hover:bg-card-surface ${
                    isActive ? "bg-azul-cobalto/10 text-azul-cobalto" : "text-azul-noche/60"
                  }`
                }>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden md:block flex-1 min-w-[160px] max-w-xs">
          <SearchInput onSearch={handleSearch} placeholder="Buscar productos..." />
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            // Mismo lugar y forma que el ícono de "iniciar sesión" de abajo,
            // pero ya logueado: un solo ícono de logout en vez de "Hola" +
            // "Cerrar sesión" aparte. Componente compartido con AdminLayout --
            // un solo lugar define el ícono de logout para toda la app.
            <LogoutButton className="hidden md:flex" />
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden md:flex w-9 h-9 rounded-full bg-card-surface items-center justify-center"
              aria-label="Iniciar sesión"
            >
              <UserIcon className="text-azul-noche" />
            </button>
          )}

          {/* Lupa: solo en mobile (en desktop el buscador ya está siempre visible) */}
          <button
            onClick={() => setIsMobileSearchOpen((open) => !open)}
            className="md:hidden w-9 h-9 rounded-full bg-card-surface flex items-center justify-center"
            aria-label="Buscar"
          >
            <SearchIcon className="text-azul-noche" />
          </button>

          <Link
            to="/carrito"
            className="relative w-9 h-9 rounded-full bg-card-surface flex items-center justify-center"
            aria-label="Ver carrito"
          >
            <CartIcon className="text-azul-noche" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rosa-coral text-white text-[9px] font-extrabold min-w-[16px] h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {isMobileSearchOpen && (
        <div className="md:hidden px-6 py-3 border-b border-gris-borde bg-white">
          <SearchInput onSearch={handleSearch} placeholder="Buscar productos..." />
        </div>
      )}

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </header>
  );
};
