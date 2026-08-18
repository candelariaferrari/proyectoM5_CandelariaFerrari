import type { CartItem } from "../types/cartItem.types";
import type { Product } from "../types/product.types";

// Estado del reducer: un carrito por usuario (clave = uid, o "guest" para
// invitados), para que cada usuario mantenga su propio carrito en la misma
// sesión del navegador.
export type CartsByUser = Record<string, CartItem[]>;

export type CartAction =
  | { type: "ADD_TO_CART"; payload: { userKey: string; product: Product; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: { userKey: string; productId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { userKey: string; productId: string; quantity: number } }
  | { type: "CLEAR_CART"; payload: { userKey: string } }
  | { type: "MERGE_GUEST_CART"; payload: { userKey: string } };

// Función pura: mismo estado + misma acción -> mismo resultado nuevo. Los
// side effects (toasts, etc.) NO van acá adentro: quedan del lado de
// CartContext, que es quien sabe "por qué" se disparó cada acción.
export const cartReducer = (state: CartsByUser, action: CartAction): CartsByUser => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { userKey, product, quantity } = action.payload;
      const currentItems = state[userKey] ?? [];
      const existing = currentItems.find((item) => item.product.id === product.id);
      const updatedItems = existing
        ? currentItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...currentItems, { product, quantity }];
      return { ...state, [userKey]: updatedItems };
    }

    case "REMOVE_FROM_CART": {
      const { userKey, productId } = action.payload;
      const currentItems = state[userKey] ?? [];
      const updatedItems = currentItems.filter((item) => item.product.id !== productId);
      return { ...state, [userKey]: updatedItems };
    }

    case "UPDATE_QUANTITY": {
      const { userKey, productId, quantity } = action.payload;
      const currentItems = state[userKey] ?? [];
      const updatedItems = currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      return { ...state, [userKey]: updatedItems };
    }

    case "CLEAR_CART": {
      const { userKey } = action.payload;
      return { ...state, [userKey]: [] };
    }

    case "MERGE_GUEST_CART": {
      // Se dispara cuando un invitado se loguea (o registra): fusiona lo que
      // tenía en el carrito de "guest" con su carrito de usuario (sumando
      // cantidades si ya tenía el mismo producto), y borra la entrada "guest"
      // para que no quede pisando el próximo invitado.
      const { userKey } = action.payload;
      const guestItems = state["guest"] ?? [];
      if (guestItems.length === 0) return state;

      const userItems = state[userKey] ?? [];
      const mergedItems = [...userItems];

      guestItems.forEach((guestItem) => {
        const existingIndex = mergedItems.findIndex(
          (item) => item.product.id === guestItem.product.id
        );
        if (existingIndex >= 0) {
          mergedItems[existingIndex] = {
            ...mergedItems[existingIndex],
            quantity: mergedItems[existingIndex].quantity + guestItem.quantity,
          };
        } else {
          mergedItems.push(guestItem);
        }
      });

      const next = { ...state, [userKey]: mergedItems };
      delete next["guest"];
      return next;
    }

    default:
      return state;
  }
};
