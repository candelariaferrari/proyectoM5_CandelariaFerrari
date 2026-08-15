import { type ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

// Modal genérico:
// solo resuelve el overlay, centrado y el cierre al hacer click afuera.
export const Modal = ({ onClose, children }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-azul-noche/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-card-lg shadow-card w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
