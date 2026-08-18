import { Modal } from "./Modal";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Reemplaza el window.confirm() nativo del navegador (que quedó por
// default al armar el borrado de productos) por un modal con el mismo
// estilo del resto de la app — mismo patrón que ya tenía diseñado el
// mockup para "¿Quitar del carrito?".
export const ConfirmDialog = ({
  title,
  message,
  confirmLabel = "Confirmar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <Modal onClose={onCancel} maxWidthClassName="max-w-sm">
    <div className="p-6 flex flex-col gap-3">
      <h2 className="font-heading font-extrabold text-xl text-azul-noche">{title}</h2>
      <p className="text-sm text-azul-noche/70">{message}</p>
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 text-sm font-bold text-azul-noche bg-card-surface rounded-pill py-2.5 transition-shadow hover:ring-2 hover:ring-inset hover:ring-gris-borde"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 text-sm font-bold text-white bg-danger rounded-pill py-2.5 transition-shadow hover:ring-2 hover:ring-inset hover:ring-white/50"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </Modal>
);
