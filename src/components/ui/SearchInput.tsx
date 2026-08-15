import { useEffect, useState } from "react";
import { SearchIcon } from "./icons";

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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmed = input.trim();
      onSearch(trimmed.length >= minLength ? trimmed : "");
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [input, onSearch, debounceMs, minLength]);

  return (
    <div className="relative w-full">
      <input
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gris-claro rounded-pill pl-4 pr-10 py-2 text-sm"
      />
      <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-azul-noche/40 pointer-events-none" />
    </div>
  );
};
