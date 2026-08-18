import { MundoLogo } from "../ui/MundoLogo";

// hidden md:block: en mobile el footer se saca del todo (ya está el
// BottomTabBar fijo abajo, y el resumen del carrito colapsable en esa
// misma página -- un footer angosto ahí solo suma ruido). El padding que
// le deja lugar al BottomTabBar fijo sigue viviendo en el wrapper de
// App.tsx, no acá, así que sacar el footer no rompe ese espacio.
export const Footer = () => {
  return (
    <footer className="hidden md:block bg-azul-noche text-white/75">
      <div className="max-w-[1280px] mx-auto px-6 py-2 flex items-center justify-between gap-8">
        <MundoLogo
          lettersClassName="text-xl"
          taglineClassName="text-[9px]"
          taglineColorClassName="text-white/60"
          showTagline
        />
        <span className="text-xs font-extrabold text-mostaza">Creado por @candeferrari</span>
      </div>
    </footer>
  );
};
