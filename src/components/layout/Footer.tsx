import { MundoLogo } from "../ui/MundoLogo";

//presentacional 
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
