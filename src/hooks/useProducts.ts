import { useContext } from "react";
import { ProductsContext } from "../contexts/ProductsContext";
//custom hook
export const useProducts = () => {
  // useContext busca el valor más cercano de <ProductsContext.Provider> en el árbol de componentes.
   const context = useContext(ProductsContext);

  // Guard: valida que el context no sea undefined ANTES de devolverlo.
  if (!context) {
    // throw corta la ejecución en este punto y lanza un error hacia arriba. throw DETIENE el componente
    // que llamó a useProducts() — no sigue renderizando con datos vacíos/rotos.
    throw new Error(
      "useProducts debe utilizarse dentro de un ProductsProvider"
    );
  }

  // Recién acá, si pasó el guard, devolvés el context ya "garantizado" (no undefined).
  return context;
};