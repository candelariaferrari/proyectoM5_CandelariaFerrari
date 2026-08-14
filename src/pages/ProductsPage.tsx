import { ProductGrid } from "../components/ProductGrid";

export const ProductsPage = () => {
  return (
    <section className="max-w-3xl mx-auto px-4 pb-10">
      <div className="rounded-card-lg bg-gradient-to-br from-mostaza to-azul-cobalto text-white p-6 mb-4">
        <div className="font-heading font-extrabold text-2xl leading-tight">Jugar. Crear.
          Descubrir.</div>
        <div className="text-sm mt-2 opacity-90">Juguetes que despiertan la imaginación y acompañan cada etapa de su desarrollo.</div>
      </div>
      <h2 className="font-heading font-extrabold text-lg text-azul-noche mb-3">Productos</h2>
      <ProductGrid />      
    </section>
  );
};