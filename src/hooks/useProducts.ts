import { useContext } from "react";
import { ProductsContext } from "../contexts/ProductsContext";
//custom hook
export const useProducts = () => {
  // useContext busca el valor más cercano de <ProductsContext.Provider> en el árbol de componentes.
  // Si este hook se usa DENTRO de un <ProductsProvider>, context va a tener el objeto real ({products, loading, ...}).
  // Si se usa FUERA (sin Provider arriba), context va a ser "undefined" (el valor inicial del createContext).
  const context = useContext(ProductsContext);

  // Guard: valida que el context no sea undefined ANTES de devolverlo.
  if (!context) {
    // throw corta la ejecución en este punto y lanza un error hacia arriba. throw DETIENE el componente
    // que llamó a useProducts() — no sigue renderizando con datos vacíos/rotos.
    // El mensaje que ves inmediatamente es
    // qué pasó y por qué: "te olvidaste de envolver esto en <ProductsProvider>".
    throw new Error(
      "useProducts debe utilizarse dentro de un ProductsProvider"
    );
  }

  // Recién acá, si pasó el guard, devolvés el context ya "garantizado" (no undefined).
  return context;
};