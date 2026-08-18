import { Link } from "react-router-dom";
import type { ReactNode } from "react";

// Botón presentacional para el CTA principal (fondo mostaza, forma pill,
// sombra) que se repetía casi textual en varias pantallas. Mismo patrón
// que vimos en clase: "solid" vs "link" como variantes discriminadas por
// `variant`, compartiendo `size` y `className`. La diferencia con el
// ejemplo de clase es que acá "link" siempre es navegación interna (usa
// <Link> de React Router, no <a href>), porque no hay links externos en
// este proyecto.
type ButtonSize = "sm" | "md" | "form";

type SolidButtonProps = {
  variant?: "solid";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

type LinkButtonProps = {
  variant: "link";
  to: string;
  state?: unknown;
};

type SharedProps = {
  children: ReactNode;
  size?: ButtonSize;
  className?: string;
};

type ButtonProps = (SolidButtonProps | LinkButtonProps) & SharedProps;

const SIZE_CLASSNAME: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5",
  md: "px-7 py-3.5",
  // Sin padding horizontal propio: se usa dentro de un formulario donde el
  // ancho lo define el contenedor (flex-col que estira los hijos, o un
  // hermano con flex-1) -- el padding horizontal de sm/md pelearía con eso.
  form: "py-3",
};

export const Button = (props: ButtonProps) => {
  const size = props.size ?? "md";
  // hover: un anillo sutil y claro (blanco al 60%) en vez de oscurecer el
  // mostaza -- más alineado con el resto de la app, que no tiene fondos
  // oscuros de hover en ningún lado.
  const baseClassName =
    `text-sm font-extrabold text-azul-noche bg-mostaza rounded-pill shadow-cta transition-shadow hover:ring-2 hover:ring-inset hover:ring-white/60 ${SIZE_CLASSNAME[size]} ${props.className ?? ""}`.trim();

  // narrowing por variant,
  if (props.variant === "link") {
    return (
      <Link to={props.to} state={props.state} className={baseClassName}>
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={`${baseClassName} disabled:opacity-60`}
    >
      {props.children}
    </button>
  );
};
