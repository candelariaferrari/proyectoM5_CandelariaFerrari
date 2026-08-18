import { Link } from "react-router-dom";
import { CategoryTiles } from "../components/products/CategoryTiles";
import { ProductCard } from "../components/products/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { Button } from "../components/ui/Button";
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
      <div className="relative overflow-hidden bg-crema mx-4 mt-4 rounded-card-lg md:mx-0 md:mt-0 md:rounded-none">
        <div className="md:hidden absolute -right-8 top-6 w-40 h-40 rounded-full bg-mostaza opacity-60" />
        <div className="md:hidden absolute -right-6 -bottom-10 w-32 h-32 rounded-full bg-azul-cobalto opacity-20" />

        <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-2 items-stretch">
          <div className="relative flex flex-col gap-5 justify-center py-10 md:py-14 md:pr-10">
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
            <Button variant="link" to="/productos" className="self-start">
              Explorar colección →
            </Button>
            <div className="hidden md:flex gap-7 mt-3 flex-wrap">
              {PERKS.map((perk) => (
                <div key={perk.title} className="flex flex-col gap-0.5 max-w-[130px]">
                  <span className="text-xs font-extrabold text-azul-noche">{perk.title}</span>
                  <span className="text-[11px] font-semibold text-azul-noche/60">{perk.sub}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex relative items-center justify-center p-6 overflow-hidden min-h-[360px] md:min-h-[440px]">
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
