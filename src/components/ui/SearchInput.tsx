import { useEffect, useRef, useState } from "react";
import { SearchIcon, CloseIcon } from "./icons";

interface SearchInputProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  debounceMs?: number;
  minLength?: number;
}

// Genérico y reutilizable:
// Solo maneja el input local y avisa por `onSearch` cuando hay que buscar,
// ya debounceado. Quien lo usa decide qué hacer con ese término y dónde ubicarlo.
export const SearchInput = ({
  onSearch,
  placeholder = "Buscar...",
  debounceMs = 400,
  minLength = 2,
}: SearchInputProps) => {
  const [input, setInput] = useState("");

  // Guardamos `onSearch` en un ref (mismo patrón que useCursorPagination
  // con fetchPage/fetchCount): así el efecto de debounce solo depende de lo
  // que el usuario tipeó, y no se reinicia si quien usa este componente nos
  // pasa una función nueva en cada render.
  const onSearchRef = useRef(onSearch);
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
        className="w-full border border-gris-claro rounded-pill pl-4 pr-10 py-2 text-sm"
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
