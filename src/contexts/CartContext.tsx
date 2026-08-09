import { createContext, useMemo, useState } from "react";
import type { CartItem } from "../types/cartItem.types";
import type { Product } from "../types/product.types";
import { useAuth } from "../hooks/useAuth"; //integración real sin props

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
  const { user } = useAuth();
  const userKey = user?.uid ?? "guest"; // clave para separar carritos

  const [cartsByUser, setCartsByUser] = useState<Record<string, CartItem[]>>({});

  const items = cartsByUser[userKey] ?? []; // el carrito "activo" se deriva, no se guarda aparte

  //acciones (logica que modifica los estados)
  const addToCart = (product: Product) => {
    setCartsByUser((prev) => {
      const currentItems = prev[userKey] ?? [];
      const existing = currentItems.find((item) => item.product.id === product.id);
      const updatedItems = existing
        ? currentItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
        : [...currentItems, { product, quantity: 1 }];

      return { ...prev, [userKey]: updatedItems }; // solo toca la entrada de este usuario
    });
  };

  const removeFromCart = (id: string) => {
    setCartsByUser((prev) => {
      const currentItems = prev[userKey] ?? [];
      const updatedItems = currentItems.filter((item) => item.product.id !== id);
      return { ...prev, [userKey]: updatedItems }; // actualiza solo el carrito de este usuario, sin tocar los de los demás
    });
  };

  const clearCart = () => {
    setCartsByUser((prev) => {
      return { ...prev, [userKey]: [] }; // vacía el carrito de este usuario, los demás quedan intactos
    });
  };

  //hook useMemo 
  const value = useMemo(() => {
    return {
      items,
      addToCart,
      removeFromCart,
      clearCart
    }
  }, [items, userKey]) // el objeto value solo se recalcula si cambia items, para no re-renderizar a los consumidores de useCart sin necesidad

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
};


