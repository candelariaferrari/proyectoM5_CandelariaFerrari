import { createContext, useMemo, useState } from "react";
import type { CartItem } from "../types/cartItem.types";
import type { Product } from "../types/product.types";

// types -> que cosas voy a necesitar compartir/transportar, estos types van aca porque son de uso interno
interface CartContextType {
  items: CartItem[]; //array de items de carrito
  //metodos
  addToCart: (producto: Product) => void; //traigo el producto agregado
  removeFromCart: (id: string) => void; //borro el producto especifico
  clearCart: () => void; //borro todo
}

//contexto, (que voy a transportar por la "autopista")
export const CartContext = createContext<CartContextType | undefined>(
  undefined //valor inicial
);

// Provider, va a retornar el contexto, es un componente de react
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  //estados (son globales), setItems es el que cambia el estado
  const [items, setItems] = useState<CartItem[]>([]); //empieza vacio porque no tengo productos cargados

  //acciones (logica que modifica los estados)
  const addToCart = (product: Product) => {
    //recibe producto
    setItems((prev) => {
      //validar cantidad de mismo producto, se trae el estado previo:
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ); //si existe le agrega uno, y si no agrega el item nuevo
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    //traigo todo lo que esta en el carrito
    setItems((prev) => prev.filter((item) => item.product.id !== id)); //filter devuelve array nuevo
  };

  const clearCart = () => {
    setItems([]); //aca react esta cambiando el estado
  };

  //hook useMemo 
  const value = useMemo(()=>{
    return{
      items, 
      addToCart,
      removeFromCart,
      clearCart
    }
  },[items]) //va a renderizar si cambia items

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
};


//custom hook
