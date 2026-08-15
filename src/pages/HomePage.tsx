import { Link } from "react-router-dom";
import { CategoryTiles } from "../components/CategoryTiles";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import nenaHero from "../assets/nena-mundo-blanco.jpg";

const FEATURED_COUNT = 4;

const PERKS = [
  { title: "Envíos a todo el país", sub: "Gratis desde $50.000" },
  { title: "Cambios sin cargo", sub: "Hasta 30 días" },
  { title: "Pago seguro", sub: "Tarjeta o transferencia" },
];

export const HomePage = () => {
  const { products, loading } = useProducts();
  const featured = products.slice(0, FEATURED_COUNT);

  return (
    <div className="pb-10">
      {/* La crema es solo del hero (como en el mockup); el resto del body queda blanco. */}
      <div className="bg-crema">
        <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-2 items-stretch">
          <div className="flex flex-col gap-5 justify-center py-10 md:py-14 md:pr-10">
            <h1 className="font-heading font-extrabold text-5xl md:text-6xl leading-[1.05] text-azul-noche">
              Jugar.
              <br />
              Crear.
              <br />
              Descubrir.
            </h1>
            <p className="text-base font-semibold text-azul-noche/70 max-w-sm">
              Juguetes que despiertan la imaginación y acompañan cada etapa de su desarrollo.
            </p>
            <Link
              to="/productos"
              className="self-start text-sm font-extrabold text-azul-noche bg-mostaza px-7 py-3.5 rounded-pill shadow-cta"
            >
              Explorar colección →
            </Link>
            <div className="flex gap-7 mt-3 flex-wrap">
              {PERKS.map((perk) => (
                <div key={perk.title} className="flex flex-col gap-0.5 max-w-[130px]">
                  <span className="text-xs font-extrabold text-azul-noche">{perk.title}</span>
                  <span className="text-[11px] font-semibold text-azul-noche/60">{perk.sub}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center p-6 overflow-hidden min-h-[360px] md:min-h-[440px]">
            <div className="absolute -right-0 top-2 w-56 h-56 rounded-full bg-mostaza opacity-60" />
            <div className="absolute left-8 bottom-16 w-20 h-20 rounded-full bg-azul-cobalto opacity-20" />
            <div className="relative w-[80%] h-[88%] rounded-card-lg overflow-hidden shadow-card">
              <img src={nenaHero} alt="Niña jugando con bloques" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6">
        <div className="my-10">
          <CategoryTiles />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-extrabold text-2xl text-azul-noche">Más elegidos</h2>
            <Link to="/productos" className="text-sm font-bold text-azul-cobalto underline">
              Ver todo
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-azul-noche/60">Cargando productos...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
