import type { CartItem } from "../types/cartItem.types";
import type { Product } from "../types/product.types";

// Estado del reducer: un carrito por usuario 
export type CartsByUser = Record<string, CartItem[]>;

export type CartAction =
  | { type: "ADD_TO_CART"; payload: { userKey: string; product: Product; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: { userKey: string; productId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { userKey: string; productId: string; quantity: number } }
  | { type: "CLEAR_CART"; payload: { userKey: string } }
  | { type: "MERGE_GUEST_CART"; payload: { userKey: string } };


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
 
    // cantidad de productos repetidos entre guest y customer
    case "MERGE_GUEST_CART": {
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
