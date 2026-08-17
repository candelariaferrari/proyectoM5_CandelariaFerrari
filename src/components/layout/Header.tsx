import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import { AuthModal } from "../AuthModal";
import { SearchInput } from "../ui/SearchInput";
import { UserIcon, CartIcon, SearchIcon } from "../ui/icons";
import { MundoLogo } from "../ui/MundoLogo";

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
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

      <div className="flex items-center justify-between gap-4 px-6 py-4 max-w-[1280px] mx-auto border-b border-gris-claro">
        <Link to="/">
          <MundoLogo />
        </Link>

        {/* A partir de md: todo el header completo, en una sola fila */}
        <nav className="hidden md:flex items-center gap-5">
          <Link to="/productos" className="text-md font-bold text-azul-noche">
            Juguetes
          </Link>
          <span className="text-md font-bold text-azul-noche/30 cursor-not-allowed" title="Próximamente">
            Ofertas
          </span>
          <Link to="/pedidos" className="text-md font-bold text-azul-noche">
            Mis pedidos
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="text-md font-bold text-azul-cobalto">
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden md:block flex-1 min-w-[160px] max-w-xs">
          <SearchInput onSearch={handleSearch} placeholder="Buscar productos..." />
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-azul-noche/70">
                Hola{user?.displayName ? `, ${user.displayName}` : ""}
              </span>
              <button onClick={logout} className="text-sm font-bold text-danger px-3 py-2 rounded-pill">
                Cerrar sesión
              </button>
            </div>
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
        <div className="md:hidden px-6 py-3 border-b border-gris-claro bg-white">
          <SearchInput onSearch={handleSearch} placeholder="Buscar productos..." />
        </div>
      )}

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </header>
  );
};
