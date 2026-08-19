import type { ReactNode } from "react";
//presentacional
interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export const FormField = ({ label, error, children }: FormFieldProps) => (
  <label className="text-sm font-bold text-azul-noche flex flex-col gap-1">
    <span>{label}</span>
    {children}
    {error && <span className="text-danger text-xs font-normal">{error}</span>}
  </label>
);

//error
export const fieldInputClassName = (hasError?: boolean) =>
  `w-full mt-1 border rounded-input px-3 py-2 text-sm font-normal ${
    hasError ? "border-danger" : "border-gris-borde"
  }`;
