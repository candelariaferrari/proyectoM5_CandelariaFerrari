import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

export const Header = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="flex items-center gap-3 px-4 py-4 max-w-3xl mx-auto">
      <div className="font-heading font-extrabold text-xl text-azul-noche mr-auto">MUNDO</div>

      {isAuthenticated ? (
        <>
          <span className="text-sm text-azul-noche/70">
            Hola{user?.displayName ? `, ${user.displayName}` : ""}
          </span>
          <button onClick={logout} className="text-sm font-bold text-danger px-3 py-2 rounded-pill">
            Cerrar sesión
          </button>
        </>
      ) : (
        <button
          onClick={() => login("customer")}
          className="text-sm font-bold text-white bg-mostaza px-4 py-2 rounded-pill"
        >
          Iniciar sesión
        </button>
      )}

      <div className="relative w-9 h-9 rounded-full bg-card-surface flex items-center justify-center">
        🛒
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-mostaza text-white text-[9px] font-extrabold min-w-[16px] h-4 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </div>
    </header>
  );
};