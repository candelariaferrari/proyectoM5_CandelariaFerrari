import { describe, expect, it } from "vitest";
import { cartReducer, type CartsByUser } from "../../src/contexts/cartReducer";
import { buildProduct } from "../fixtures";

// El reducer es una función pura: mismo estado + misma acción -> mismo
// resultado, sin efectos secundarios. Por eso se puede testear sin
// renderizar nada ni mockear Firebase: solo le pasamos un estado "de
// entrada" y comparamos contra el estado "de salida" esperado.
describe("cartReducer", () => {
  it("ADD_TO_CART agrega un producto nuevo al carrito del usuario", () => {
    const product = buildProduct();
    const state: CartsByUser = {};

    const next = cartReducer(state, {
      type: "ADD_TO_CART",
      payload: { userKey: "user-1", product, quantity: 1 },
    });

    expect(next["user-1"]).toEqual([{ product, quantity: 1 }]);
  });

  it("ADD_TO_CART suma la cantidad si el producto ya estaba en el carrito", () => {
    const product = buildProduct();
    const state: CartsByUser = { "user-1": [{ product, quantity: 2 }] };

    const next = cartReducer(state, {
      type: "ADD_TO_CART",
      payload: { userKey: "user-1", product, quantity: 3 },
    });

    expect(next["user-1"]).toEqual([{ product, quantity: 5 }]);
  });

  it("ADD_TO_CART no toca el carrito de otros usuarios", () => {
    const productA = buildProduct({ id: "a" });
    const productB = buildProduct({ id: "b" });
    const state: CartsByUser = { guest: [{ product: productB, quantity: 1 }] };

    const next = cartReducer(state, {
      type: "ADD_TO_CART",
      payload: { userKey: "user-1", product: productA, quantity: 1 },
    });

    expect(next.guest).toEqual([{ product: productB, quantity: 1 }]);
    expect(next["user-1"]).toEqual([{ product: productA, quantity: 1 }]);
  });

  it("REMOVE_FROM_CART elimina el producto indicado", () => {
    const productA = buildProduct({ id: "a" });
    const productB = buildProduct({ id: "b" });
    const state: CartsByUser = {
      "user-1": [
        { product: productA, quantity: 1 },
        { product: productB, quantity: 2 },
      ],
    };

    const next = cartReducer(state, {
      type: "REMOVE_FROM_CART",
      payload: { userKey: "user-1", productId: "a" },
    });

    expect(next["user-1"]).toEqual([{ product: productB, quantity: 2 }]);
  });

  it("UPDATE_QUANTITY cambia la cantidad del producto indicado", () => {
    const product = buildProduct();
    const state: CartsByUser = { "user-1": [{ product, quantity: 1 }] };

    const next = cartReducer(state, {
      type: "UPDATE_QUANTITY",
      payload: { userKey: "user-1", productId: product.id, quantity: 7 },
    });

    expect(next["user-1"]).toEqual([{ product, quantity: 7 }]);
  });

  it("CLEAR_CART vacía el carrito del usuario sin afectar a otros", () => {
    const product = buildProduct();
    const state: CartsByUser = {
      "user-1": [{ product, quantity: 1 }],
      guest: [{ product, quantity: 1 }],
    };

    const next = cartReducer(state, {
      type: "CLEAR_CART",
      payload: { userKey: "user-1" },
    });

    expect(next["user-1"]).toEqual([]);
    expect(next.guest).toEqual([{ product, quantity: 1 }]);
  });

  it("MERGE_GUEST_CART fusiona el carrito invitado con el del usuario, sumando cantidades repetidas", () => {
    const productA = buildProduct({ id: "a" });
    const productB = buildProduct({ id: "b" });
    const state: CartsByUser = {
      guest: [
        { product: productA, quantity: 2 },
        { product: productB, quantity: 1 },
      ],
      "user-1": [{ product: productA, quantity: 1 }],
    };

    const next = cartReducer(state, {
      type: "MERGE_GUEST_CART",
      payload: { userKey: "user-1" },
    });

    expect(next["user-1"]).toEqual(
      expect.arrayContaining([
        { product: productA, quantity: 3 },
        { product: productB, quantity: 1 },
      ])
    );
    expect(next.guest).toBeUndefined();
  });

  it("MERGE_GUEST_CART no hace nada si no había carrito de invitado", () => {
    const state: CartsByUser = { "user-1": [] };

    const next = cartReducer(state, {
      type: "MERGE_GUEST_CART",
      payload: { userKey: "user-1" },
    });

    expect(next).toBe(state); // misma referencia: no se generó un estado nuevo de más
  });

  it("no muta el estado anterior (inmutabilidad)", () => {
    const product = buildProduct();
    const state: CartsByUser = { "user-1": [{ product, quantity: 1 }] };
    const stateCopy = structuredClone(state);

    cartReducer(state, {
      type: "ADD_TO_CART",
      payload: { userKey: "user-1", product, quantity: 1 },
    });

    expect(state).toEqual(stateCopy);
  });
});
