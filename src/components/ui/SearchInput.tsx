import { useEffect, useRef, useState } from "react";
import { SearchIcon, CloseIcon } from "./icons";
//presentacional
interface SearchInputProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  debounceMs?: number;
  minLength?: number;
  autoFocus?: boolean; // para cuando el input aparece a partir de una acción del usuario (ej. tocar la lupa en mobile)
}

// Genérico y reutilizable
export const SearchInput = ({
  onSearch,
  placeholder = "Buscar...",
  debounceMs = 400,
  minLength = 2,
  autoFocus = false,
}: SearchInputProps) => {
  const [input, setInput] = useState("");

  // Guardamos `onSearch` en un ref 
  const onSearchRef = useRef(onSearch);
  
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
