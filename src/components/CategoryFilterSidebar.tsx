import type { CategoryId } from "../types/product.types";
import { CATEGORY_INFO, CATEGORY_IDS } from "../constants/categories";

interface CategoryFilterSidebarProps {
  categoryFilter: CategoryId | null;
  onSelectCategory: (category: CategoryId | null) => void;
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;
  onClearFilters: () => void;
}

// Sidebar de la página de catálogo (/productos). A diferencia de las tiles de
// la Home, acá el click no navega: actualiza el Context (categoryFilter) y la
// URL al mismo tiempo, para que el filtro activo quede reflejado en ambos.
export const CategoryFilterSidebar = ({
  categoryFilter,
  onSelectCategory,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  onClearFilters,
}: CategoryFilterSidebarProps) => {
  return (
    <aside className="flex flex-col gap-6 h-fit">
      <div>
        <h3 className="text-xs font-bold uppercase text-azul-noche/60 mb-2">Tipo de juego</h3>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onSelectCategory(null)}
            className={`text-left text-sm font-bold px-4 py-2.5 rounded-input ${
              categoryFilter === null ? "bg-azul-cobalto text-white" : "bg-card-surface text-azul-noche"
            }`}
          >
            Todos
          </button>
          {CATEGORY_IDS.map((id) => (
            <button
              key={id}
              onClick={() => onSelectCategory(id)}
              // Activa: fondo del color propio de esa categoría (igual que las
              // tiles de la Home). Inactiva: fondo neutro con el texto en el
              // color (oscuro) de la categoría.
              className={`text-left text-sm font-bold px-4 py-2.5 rounded-input ${
                categoryFilter === id
                  ? `${CATEGORY_INFO[id].color} text-white`
                  : `bg-card-surface ${CATEGORY_INFO[id].textColor}`
              }`}
            >
              {CATEGORY_INFO[id].label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase text-azul-noche/60 mb-2">Precio</h3>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            value={priceMin}
            onChange={(e) => onPriceMinChange(e.target.value)}
            placeholder="$0"
            className="w-full border border-gris-claro rounded-input px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={0}
            value={priceMax}
            onChange={(e) => onPriceMaxChange(e.target.value)}
            placeholder="$50.000"
            className="w-full border border-gris-claro rounded-input px-3 py-2 text-sm"
          />
        </div>
      </div>

      <button
        onClick={onClearFilters}
        className="text-sm font-bold text-azul-noche bg-card-surface rounded-pill py-2.5"
      >
        Limpiar filtros
      </button>
    </aside>
  );
};
