import type { CategoryId } from "../types/product.types";
import { LightbulbIcon, PaletteIcon, HeartIcon, CompassIcon, type IconComponent } from "../components/ui/icons";

// Fuente única de info de categorías (label, color, descripción).
export const CATEGORY_INFO: Record<
  CategoryId,
  { label: string; description: string; color: string; textColor: string; icon: IconComponent }
> = {
  pensar: {
    label: "Pensar",
    description: "Juegos de mesa y lógica",
    color: "bg-verde-menta",
    textColor: "text-verde-texto",
    icon: LightbulbIcon,
  },
  crear: {
    label: "Crear",
    description: "Arte, manualidades y creatividad",
    color: "bg-mostaza",
    textColor: "text-mostaza-texto",
    icon: PaletteIcon,
  },
  compartir: {
    label: "Compartir",
    description: "Para jugar en familia y con amigos",
    color: "bg-rosa-coral",
    textColor: "text-rosa-texto",
    icon: HeartIcon,
  },
  explorar: {
    label: "Explorar",
    description: "Aire libre, movimiento y aventura",
    color: "bg-azul-cobalto",
    textColor: "text-azul-cobalto",
    icon: CompassIcon,
  },
};

export const CATEGORY_IDS = Object.keys(CATEGORY_INFO) as CategoryId[];
