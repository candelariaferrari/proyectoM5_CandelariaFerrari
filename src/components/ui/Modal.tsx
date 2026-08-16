import { type ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  maxWidthClassName?: string; // ej. "max-w-lg" para formularios con más campos
}

// Modal genérico:
// solo resuelve el overlay, centrado y el cierre al hacer click afuera.
export const Modal = ({ onClose, children, maxWidthClassName = "max-w-sm" }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-azul-noche/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-card-lg shadow-card w-full ${maxWidthClassName} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
