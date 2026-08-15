import type { CategoryId } from "../types/product.types";

// Fuente única de info de categorías (label, color, descripción), para no
// repetir estos datos en CategoryTiles, CategoryFilterSidebar, ProductCard y
// ProductDetailPage.
// - "color": bg sólido, para tiles/badges de fondo de color.
// - "textColor": variante oscura del mismo tono, para usar como texto sobre
//   fondo blanco/claro (mostaza y rosa-coral son muy claros para eso).
export const CATEGORY_INFO: Record<
  CategoryId,
  { label: string; description: string; color: string; textColor: string }
> = {
  pensar: {
    label: "Pensar",
    description: "Juegos de mesa y lógica",
    color: "bg-verde-menta",
    textColor: "text-verde-texto",
  },
  crear: {
    label: "Crear",
    description: "Arte, manualidades y creatividad",
    color: "bg-mostaza",
    textColor: "text-mostaza-texto",
  },
  compartir: {
    label: "Compartir",
    description: "Para jugar en familia y con amigos",
    color: "bg-rosa-coral",
    textColor: "text-rosa-texto",
  },
  explorar: {
    label: "Explorar",
    description: "Aire libre, movimiento y aventura",
    color: "bg-azul-cobalto",
    textColor: "text-azul-cobalto",
  },
};

export const CATEGORY_IDS = Object.keys(CATEGORY_INFO) as CategoryId[];
