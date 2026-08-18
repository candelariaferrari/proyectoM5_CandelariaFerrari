import { useEffect, useRef, useState } from "react";
import { SearchIcon, CloseIcon } from "./icons";

interface SearchInputProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  debounceMs?: number;
  minLength?: number;
  autoFocus?: boolean; // para cuando el input aparece a partir de una acción del usuario (ej. tocar la lupa en mobile)
}

// Genérico y reutilizable:
// Solo maneja el input local y avisa por `onSearch` cuando hay que buscar,
// ya debounceado. Quien lo usa decide qué hacer con ese término y dónde ubicarlo.
export const SearchInput = ({
  onSearch,
  placeholder = "Buscar...",
  debounceMs = 400,
  minLength = 2,
  autoFocus = false,
}: SearchInputProps) => {
  const [input, setInput] = useState("");

  // Guardamos `onSearch` en un ref (mismo patrón que useCursorPagination
  // con fetchPage/fetchCount): así el efecto de debounce solo depende de lo
  // que el usuario tipeó, y no se reinicia si quien usa este componente nos
  // pasa una función nueva en cada render.
  const onSearchRef = useRef(onSearch);
  // Este ref nunca se LEE durante el render (solo se escribe acá; se lee
  // recién dentro del setTimeout del efecto de abajo), así que no hay
  // riesgo de que el render dependa de un valor mutable -- es justamente
  // el patrón "ref con el valor más reciente" que React recomienda para
  // no reiniciar un efecto cuando cambia una función. La regla
  // react-hooks/refs (nueva en eslint-plugin-react-hooks v7 / React
  // Compiler) todavía no distingue "escribir" de "leer durante el
  // render" y marca cualquier escritura a .current como error.
  // https://github.com/facebook/react/issues/34954
  // eslint-disable-next-line react-hooks/refs
  onSearchRef.current = onSearch;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmed = input.trim();
      onSearchRef.current(trimmed.length >= minLength ? trimmed : "");
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [input, debounceMs, minLength]);

  // No espera al debounce: borrar tiene que sentirse instantáneo.
  const handleClear = () => {
    setInput("");
    onSearch("");
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full border border-gris-borde rounded-pill pl-4 pr-10 py-2 text-sm"
      />
      {input ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-azul-noche/40 hover:text-azul-noche/70"
        >
          <CloseIcon size={16} />
        </button>
      ) : (
        <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-azul-noche/40 pointer-events-none" />
      )}
    </div>
  );
};
