import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CartItem } from "../types/cartItem.types";
import type { Product } from "../types/product.types";
import { useAuth } from "../hooks/useAuth"; //integración real sin props
import { useToast } from "../hooks/useToast";

// types -> que cosas voy a necesitar compartir/transportar, estos types van aca porque son de uso interno
interface CartContextType {
  items: CartItem[]; //array de items de carrito
  //metodos
  addToCart: (producto: Product, quantity?: number) => void; //traigo el producto agregado, y cuántas unidades (por defecto 1)
  removeFromCart: (id: string) => void; //borro el producto especifico
  updateQuantity: (id: string, quantity: number) => void; //cambio la cantidad de un item ya agregado 
  clearCart: () => void; //borro todo
}

//contexto, (que voy a transportar por la "autopista")
// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContextType | undefined>(
  undefined //valor inicial
);

// Provider, va a retornar el contexto, es un componente de react
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const userKey = user?.uid ?? "guest"; // clave para separar carritos
  const { showToast } = useToast();

  const [cartsByUser, setCartsByUser] = useState<Record<string, CartItem[]>>({});

  // memoizado con sus propias dependencias reales, para no recrearse en cada render
  const items = useMemo(() => cartsByUser[userKey] ?? [], [cartsByUser, userKey]); // el carrito "activo" se deriva, no se guarda aparte

  // Guarda cuál era el userKey en el render anterior, para poder detectar el
  // momento exacto en que se pasa de invitado a logueado (no se puede saber
  // eso mirando solo el userKey actual).
  const previousUserKeyRef = useRef(userKey);

  useEffect(() => {
    const previousUserKey = previousUserKeyRef.current;

    // Si antes era "guest" y ahora es un uid real, el usuario se acaba de
    // loguear (o registrar). Fusionamos lo que había en el carrito de
    // invitado con su carrito de usuario, en vez de perderlo.
    if (previousUserKey === "guest" && userKey !== "guest") {
      setCartsByUser((prev) => {
        const guestItems = prev["guest"] ?? [];
        if (guestItems.length === 0) return prev; // no había nada que fusionar

        const userItems = prev[userKey] ?? [];
        const mergedItems = [...userItems];

        guestItems.forEach((guestItem) => {
          const existingIndex = mergedItems.findIndex(
            (item) => item.product.id === guestItem.product.id
          );
          if (existingIndex >= 0) {
            // Ya tenía este producto guardado: sumamos las cantidades en vez de duplicar la fila
            mergedItems[existingIndex] = {
              ...mergedItems[existingIndex],
              quantity: mergedItems[existingIndex].quantity + guestItem.quantity,
            };
          } else {
            mergedItems.push(guestItem);
          }
        });

        const next = { ...prev, [userKey]: mergedItems };
        delete next["guest"]; // ya se fusionó, no lo dejamos pisando el próximo invitado
        return next;
      });
    }

    previousUserKeyRef.current = userKey;
  }, [userKey]);

  //acciones (logica que modifica los estados)

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartsByUser((prev) => {
      const currentItems = prev[userKey] ?? [];
      const existing = currentItems.find((item) => item.product.id === product.id);
      const updatedItems = existing
        ? currentItems.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...currentItems, { product, quantity }];
      return { ...prev, [userKey]: updatedItems }; // solo toca la entrada de este usuario
    });
    showToast(`"${product.name}" agregado al carrito`);
  }, [userKey, showToast]);
  const removeFromCart = useCallback((id: string) => {
    // Buscamos el nombre en `items` (el carrito ya derivado de este render),
    // no adentro del updater de setCartsByUser: ese updater tiene que ser
    // puro (React puede llamarlo más de una vez), así que no puede disparar
    // un showToast (que a su vez hace setState) desde ahí adentro.
    const removedItem = items.find((item) => item.product.id === id);

    setCartsByUser((prev) => {
      const currentItems = prev[userKey] ?? [];
      const updatedItems = currentItems.filter((item) => item.product.id !== id);
      return { ...prev, [userKey]: updatedItems }; // actualiza solo el carrito de este usuario, sin tocar los de los demás
    });

    if (removedItem) {
      showToast(`"${removedItem.product.name}" eliminado del carrito`, "danger");
    }
  }, [userKey, showToast, items]);

  // Cambia la cantidad de un item puntual (lo usa la página de carrito con los botones +/-)
  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCartsByUser((prev) => {
      const currentItems = prev[userKey] ?? [];
      const updatedItems = currentItems.map((item) =>
        item.product.id === id ? { ...item, quantity } : item
      );
      return { ...prev, [userKey]: updatedItems };
    });
  }, [userKey]);

  const clearCart =  useCallback(() => {
    setCartsByUser((prev) => {
      return { ...prev, [userKey]: [] }; // vacía el carrito de este usuario, los demás quedan intactos
    });
  }, [userKey]);


  //hook useMemo 
    const value = useMemo(
    () => ({ items, addToCart, removeFromCart, updateQuantity, clearCart }),
    [items, addToCart, removeFromCart, updateQuantity, clearCart]
  );
// el objeto value solo se recalcula si cambia items, para no re-renderizar a los consumidores de useCart sin necesidad

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
};


