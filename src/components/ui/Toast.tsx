import { useToast } from "../../hooks/useToast";

export const Toast = () => {
  const { toast } = useToast();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-azul-noche text-white rounded-pill px-5 py-3.5 shadow-card"
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${toast.tone === "danger" ? "bg-rosa-coral" : "bg-verde-menta"}`} />
      <span className="text-sm font-extrabold whitespace-nowrap">{toast.message}</span>
    </div>
  );
};
