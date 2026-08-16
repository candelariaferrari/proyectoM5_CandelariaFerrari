import { ListIcon } from "../../components/ui/icons";

export const AdminOrdersPage = () => {
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-16 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-card-surface flex items-center justify-center">
        <ListIcon size={26} className="text-azul-noche/40" />
      </div>
      <h1 className="font-heading font-extrabold text-2xl text-azul-noche">No hay órdenes todavía</h1>
      <p className="text-sm text-azul-noche/60">Cuando haya pedidos, los vas a poder gestionar acá.</p>
    </section>
  );
};
