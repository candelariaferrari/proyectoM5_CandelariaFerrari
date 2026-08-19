import { type ReactNode } from "react";
import { CloseIcon } from "./icons";
//presentacional
interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  maxWidthClassName?: string; // ej. "max-w-lg" para formularios con más campos
}

// Modal genérico:
export const Modal = ({ onClose, children, maxWidthClassName = "max-w-sm" }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-azul-noche/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded-card-lg shadow-card w-full ${maxWidthClassName} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-card-surface flex items-center justify-center text-azul-noche/60 hover:text-azul-noche z-10"
        >
          <CloseIcon size={14} />
        </button>
        {children}
      </div>
    </div>
  );
};
