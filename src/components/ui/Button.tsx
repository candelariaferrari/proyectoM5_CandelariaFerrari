import { Link } from "react-router-dom";
import type { ReactNode } from "react";

// Botón presentacional para el CTA principal
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

  form: "py-3",
};

export const Button = (props: ButtonProps) => {
  const size = props.size ?? "md";
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
