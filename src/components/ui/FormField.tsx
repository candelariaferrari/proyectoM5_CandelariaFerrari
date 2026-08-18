import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

// Wrapper compartido para label + campo + mensaje de error. Se usa en el
// form de productos (admin) y en el modal de login/registro — el input en
// sí lo arma quien lo usa (varían: texto, número, contraseña, textarea),
// este componente solo estandariza cómo se ve el label y el error abajo,
// para no repetir el mismo patrón suelto en cada formulario.
export const FormField = ({ label, error, children }: FormFieldProps) => (
  <label className="text-sm font-bold text-azul-noche flex flex-col gap-1">
    <span>{label}</span>
    {children}
    {error && <span className="text-danger text-xs font-normal">{error}</span>}
  </label>
);

// Clase del input/textarea, según si ese campo puntual tiene error o no.
// Se pasa a mano en cada campo (no queda adentro de FormField) porque cada
// input necesita saber su propio estado de error para pintarse de rojo.
export const fieldInputClassName = (hasError?: boolean) =>
  `w-full mt-1 border rounded-input px-3 py-2 text-sm font-normal ${
    hasError ? "border-danger" : "border-gris-borde"
  }`;
