import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import { AuthModal } from "../AuthModal";
import { SearchInput } from "../ui/SearchInput";
import { UserIcon, CartIcon } from "../ui/icons";

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const { setSearchTerm } = useProducts();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const navigate = useNavigate();

  // Buscar desde cualquier página te lleva al catálogo, que es el único
  // lugar que renderiza los resultados.
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) navigate("/productos");
  };

  return (
    <header>
      <div className="bg-verde-menta text-white text-center py-2 text-xs font-bold">
        Envíos gratis en compras mayores a $50.000
      </div>
      <div className="flex items-center justify-between gap-6 px-6 py-4 max-w-[1280px] mx-auto flex-wrap border-b border-gris-claro">
        <div className="flex items-center gap-7">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-heading font-extrabold text-4xl">
              <span className="text-mostaza">M</span>
              <span className="text-azul-cobalto">U</span>
              <span className="text-rosa-coral">N</span>
              <span className="text-azul-cobalto">D</span>
              <span className="text-verde-menta">O</span>
            </span>
            <span className="text-[12px] font-bold text-azul-noche/60">Ideas para jugar.</span>
          </Link>

          <nav className="hidden md:flex gap-5">
            <Link to="/productos" className="text-md font-bold text-azul-noche">
              Juguetes
            </Link>
            <span className="text-md font-bold text-azul-noche/30 cursor-not-allowed" title="Próximamente">
              Ofertas
            </span>
            <span className="text-md font-bold text-azul-noche/30 cursor-not-allowed" title="Próximamente">
              Mis pedidos
            </span>
          </nav>
        </div>

        <div className="flex-1 min-w-[160px] max-w-xs">
          <SearchInput onSearch={handleSearch} placeholder="Buscar productos..." />
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-azul-noche/70 hidden sm:inline">
                Hola{user?.displayName ? `, ${user.displayName}` : ""}
              </span>
              <button onClick={logout} className="text-sm font-bold text-danger px-3 py-2 rounded-pill">
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-9 h-9 rounded-full bg-card-surface flex items-center justify-center"
              aria-label="Iniciar sesión"
            >
              <UserIcon className="text-azul-noche" />
            </button>
          )}

          <div className="relative w-9 h-9 rounded-full bg-card-surface flex items-center justify-center">
            <CartIcon className="text-azul-noche" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rosa-coral text-white text-[9px] font-extrabold min-w-[16px] h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </header>
  );
};
