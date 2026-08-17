interface MundoLogoProps {
  lettersClassName?: string; // tamaño de las letras "MUNDO"
  taglineClassName?: string; // tamaño del tagline
  taglineColorClassName?: string; // color del tagline (separado del tamaño para poder usarlo sobre fondo oscuro, ej. el footer)
  showTagline?: boolean;
}

// Wordmark "MUNDO" con sus 5 colores fijos. Se repetía igual en el Header
// de cliente y en el header de admin (desktop y mobile) — ahora vive en un
// solo lugar y cada uno solo ajusta el tamaño de letra.
export const MundoLogo = ({
  lettersClassName = "text-3xl md:text-4xl",
  taglineClassName = "text-[10px] md:text-[12px]",
  taglineColorClassName = "text-azul-noche/60",
  showTagline = true,
}: MundoLogoProps) => (
  <div className="flex flex-col leading-none">
    <span className={`font-heading font-extrabold ${lettersClassName}`}>
      <span className="text-mostaza">M</span>
      <span className="text-azul-cobalto">U</span>
      <span className="text-rosa-coral">N</span>
      <span className="text-azul-cobalto">D</span>
      <span className="text-verde-menta">O</span>
    </span>
    {showTagline && (
      <span className={`font-bold ${taglineColorClassName} ${taglineClassName}`}>Ideas para jugar.</span>
    )}
  </div>
);
