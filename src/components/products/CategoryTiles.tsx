import { Link } from "react-router-dom";
import { CATEGORY_INFO } from "../../constants/categories";

export const CategoryTiles = () => {
  return (
    <div>
      <h2 className="font-heading font-extrabold text-3xl text-azul-noche text-center mb-6">
        ¿Qué tipo de juego buscás?
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
        {Object.entries(CATEGORY_INFO).map(([id, cat]) => {
          const Icon = cat.icon;
          return (
            <Link
              key={id}
              to={`/productos?categoria=${id}`}
              className={`${cat.color} text-white rounded-card p-5 flex flex-row items-center justify-center gap-2 w-64 shrink-0 md:w-auto`}
            >
              <span className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center">
                <Icon size={25} />
              </span>
              <span>
                <p className="font-heading font-extrabold text-xl">{cat.label}</p>
                <p className="text-[12px] opacity-90"> {cat.description}</p>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
