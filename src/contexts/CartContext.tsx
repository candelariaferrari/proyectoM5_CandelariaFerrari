import { createContext, useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import type { CartItem } from "../types/cartItem.types";
import type { Product } from "../types/product.types";
import { useAuth } from "../hooks/useAuth"; //integración real sin props
import { useToast } from "../hooks/useToast";
import { cartReducer } from "./cartReducer";

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

  // La lógica de cada acción (agregar, eliminar, actualizar cantidad,
  // limpiar, fusionar carrito de invitado) vive en cartReducer, como función
  // pura: dado el mismo estado + la misma acción, siempre da el mismo
  // resultado. Acá el Provider solo dispara acciones y maneja los side
  // effects (toasts) que dependen de "por qué" se disparó cada una.
  const [cartsByUser, dispatch] = useReducer(cartReducer, {});

  // memoizado con sus propias dependencias reales, para no recrearse en cada render
  const items = useMemo(() => cartsByUser[userKey] ?? [], [cartsByUser, userKey]); // el carrito "activo" se deriva, no se guarda aparte

  // Guarda cuál era el userKey en el render anterior, para poder detectar el
  // momento exacto en que se pasa de invitado a logueado (no se puede saber
  // eso mirando solo el userKey actual).
  const previousUserKeyRef = useRef(userKey);

  useEffect(() => {
    const previousUserKey = previousUserKeyRef.current;

    // Si antes era "guest" y ahora es un uid real, el usuario se acaba de
    // loguear (o registrar): fusionamos su carrito de invitado con el suyo.
    if (previousUserKey === "guest" && userKey !== "guest") {
      dispatch({ type: "MERGE_GUEST_CART", payload: { userKey } });
    }

    previousUserKeyRef.current = userKey;
  }, [userKey]);

  //acciones (disparan la acción correspondiente al reducer + side effects)

  const addToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      dispatch({ type: "ADD_TO_CART", payload: { userKey, product, quantity } });
      showToast(`"${product.name}" agregado al carrito`);
    },
    [userKey, showToast]
  );

  const removeFromCart = useCallback(
    (id: string) => {
      // Buscamos el nombre en `items` (el carrito ya derivado de este
      // render) y no adentro del reducer: el reducer tiene que quedar puro,
      // sin disparar showToast (que a su vez hace setState) desde ahí.
      const removedItem = items.find((item) => item.product.id === id);

      dispatch({ type: "REMOVE_FROM_CART", payload: { userKey, productId: id } });

      if (removedItem) {
        showToast(`"${removedItem.product.name}" eliminado del carrito`, "danger");
      }
    },
    [userKey, showToast, items]
  );

  // Cambia la cantidad de un item puntual (lo usa la página de carrito con los botones +/-)
  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      dispatch({ type: "UPDATE_QUANTITY", payload: { userKey, productId: id, quantity } });
    },
    [userKey]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART", payload: { userKey } });
  }, [userKey]);

  //hook useMemo
  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, updateQuantity, clearCart }),
    [items, addToCart, removeFromCart, updateQuantity, clearCart]
  );
  // el objeto value solo se recalcula si cambia items, para no re-renderizar a los consumidores de useCart sin necesidad

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
