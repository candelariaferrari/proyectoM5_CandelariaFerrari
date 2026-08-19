import { useAuth } from "../../hooks/useAuth";
import { LogoutIcon } from "./icons";
//contenedor
// Botón de logout único
interface LogoutButtonProps {
  size?: "sm" | "md"; // sm: header mobile del admin (más chico); md: default
  label?: string; // texto base del aria-label/title
  showName?: boolean; // agrega "(Nombre)" al label si hay displayName
  className?: string; // para que el caller sume visibilidad (ej. "hidden md:flex")
}

const SIZE_STYLES: Record<"sm" | "md", { box: string; icon: number }> = {
  md: { box: "w-9 h-9", icon: 17 },
  sm: { box: "w-7 h-7", icon: 14 },
};

export const LogoutButton = ({
  size = "md",
  label = "Cerrar sesión",
  showName = true,
  className = "",
}: LogoutButtonProps) => {
  const { logout, user } = useAuth();
  const { box, icon } = SIZE_STYLES[size];
  const fullLabel = showName && user?.displayName ? `${label} (${user.displayName})` : label;

  return (
    <button
      onClick={logout}
      className={`${box} rounded-full bg-card-surface flex items-center justify-center text-azul-noche hover:bg-stock-low hover:text-danger transition-colors ${className}`}
      aria-label={fullLabel}
      title={fullLabel}
    >
      <LogoutIcon size={icon} />
    </button>
  );
};
