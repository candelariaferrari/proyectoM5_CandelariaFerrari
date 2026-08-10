import { ProductGrid } from "../components/ProductGrid";

export const ProductsPage = () => {
  return (
    <section className="max-w-3xl mx-auto px-4 pb-10">
      <div className="rounded-card-lg bg-gradient-to-br from-punch-red to-cerulean text-white p-6 mb-4">
        <div className="text-xs uppercase tracking-wide opacity-90">Colección invierno 2026</div>
        <div className="font-extrabold text-xl mt-1">Equipo técnico para tu próxima travesía</div>
      </div>
      <h2 className="font-extrabold text-lg text-oxford-navy mb-3">Productos</h2>
      <ProductGrid />
    </section>
  );
};