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
  // hover:bg-mostaza-texto: mismo criterio que "Agregar al carrito" en
  // ProductCard -- la versión oscura de mostaza (pensada para texto, pero
  // funciona igual de bien como hover de fondo) en vez de un mostaza más
  // claro, que sobre fondo blanco casi no se nota el cambio.
  const baseClassName =
    `text-sm font-extrabold text-azul-noche bg-mostaza rounded-pill shadow-cta transition-colors hover:bg-mostaza-texto ${SIZE_CLASSNAME[size]} ${props.className ?? ""}`.trim();

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
