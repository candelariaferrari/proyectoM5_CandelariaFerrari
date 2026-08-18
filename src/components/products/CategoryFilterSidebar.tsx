import type { CategoryId } from "../../types/product.types";
import { CATEGORY_INFO, CATEGORY_IDS } from "../../constants/categories";

interface CategoryFilterSidebarProps {
  categoryFilter: CategoryId | null;
  onSelectCategory: (category: CategoryId | null) => void;
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;
  onClearFilters: () => void;
}

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
    <aside className="flex flex-col gap-6 md:h-fit min-w-0">
      <div>
        <h3 className="text-xs font-bold uppercase text-azul-noche/60 mb-2">Tipo de juego</h3>
        <div className="flex gap-2 overflow-x-auto overflow-y-hidden pb-1 -mx-6 px-6 md:mx-0 md:px-0 md:flex-col md:gap-1.5 md:overflow-visible">
          <button
            onClick={() => onSelectCategory(null)}
            className={`shrink-0 text-left text-sm font-bold px-4 py-2.5 rounded-pill md:rounded-input ${
              categoryFilter === null ? "bg-azul-cobalto text-white" : "bg-card-surface text-azul-noche"
            }`}
          >
            Todos
          </button>
          {CATEGORY_IDS.map((id) => (
            <button
              key={id}
              onClick={() => onSelectCategory(id)}
              className={`shrink-0 text-left text-sm font-bold px-4 py-2.5 rounded-pill md:rounded-input ${
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
            className="w-full border border-gris-borde rounded-input px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={0}
            value={priceMax}
            onChange={(e) => onPriceMaxChange(e.target.value)}
            placeholder="$50.000"
            className="w-full border border-gris-borde rounded-input px-3 py-2 text-sm"
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
