import { CartContext } from "../contexts/CartContext";
import { useContext } from "react";

export const useCart = () => {
//obtenemos contexto
  const context = useContext(CartContext);
//guardian
  if (!context) {

    throw new Error(
      "useCart debe utilizarse dentro de un CartProvider"
    );
  }
  //retornamos contexto
  return context;
};