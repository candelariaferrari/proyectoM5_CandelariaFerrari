import type { CategoryId } from "../types/product.types";
import { useProducts } from "../hooks/useProducts";

const CATEGORIES: { id: CategoryId; label: string; color: string }[] = [
  { id: "pensar", label: "Pensar", color: "bg-verde-menta" },
  { id: "crear", label: "Crear", color: "bg-mostaza" },
  { id: "compartir", label: "Compartir", color: "bg-rosa-coral" },
  { id: "explorar", label: "Explorar", color: "bg-azul-cobalto" },
];

export const CategoryTiles = () => {
  const { categoryFilter, setCategoryFilter } = useProducts();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
      <button
        onClick={() => setCategoryFilter(null)}
        className={`shrink-0 text-sm font-bold px-4 py-2 rounded-pill ${
          categoryFilter === null
            ? "bg-azul-noche text-white"
            : "bg-card-surface text-azul-noche"
        }`}
      >
        Todos
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategoryFilter(cat.id)}
          className={`shrink-0 text-sm font-bold px-4 py-2 rounded-pill text-white ${cat.color} ${
            categoryFilter === cat.id ? "ring-2 ring-azul-noche" : ""
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};
