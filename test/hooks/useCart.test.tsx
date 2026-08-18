import type { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCart } from "../../src/hooks/useCart";
import { ToastProvider } from "../../src/contexts/ToastContext";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { CartProvider } from "../../src/contexts/CartContext";
import { buildProduct } from "../fixtures";

// Wrapper mínimo: CartProvider necesita useAuth() y useToast() para
// funcionar, así que hay que envolverlo en esos dos providers. Firebase ya
// está mockeado de forma global (test/setupTests.ts) así que AuthProvider
// resuelve "sin usuario" sin pegarle a la red -- esto es lo que hace que el
// test esté "aislado": no depende de un contexto real, solo de sus props.
const wrapper = ({ children }: { children: ReactNode }) => (
  <ToastProvider>
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  </ToastProvider>
);

describe("useCart", () => {
  it("explota si se usa fuera de un CartProvider (guard clause)", () => {
    // Sin wrapper: no hay CartContext disponible.
    expect(() => renderHook(() => useCart())).toThrow(
      "useCart debe utilizarse dentro de un CartProvider"
    );
  });

  it("empieza con el carrito vacío", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
  });

  it("addToCart agrega un producto", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = buildProduct();

    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.items).toEqual([{ product, quantity: 1 }]);
  });

  it("addToCart dos veces el mismo producto suma cantidades en vez de duplicar", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = buildProduct();

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product, 2);
    });

    expect(result.current.items).toEqual([{ product, quantity: 3 }]);
  });

  it("updateQuantity cambia la cantidad de un item existente", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = buildProduct();

    act(() => {
      result.current.addToCart(product);
    });
    act(() => {
      result.current.updateQuantity(product.id, 5);
    });

    expect(result.current.items).toEqual([{ product, quantity: 5 }]);
  });

  it("removeFromCart saca el producto del carrito", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = buildProduct();

    act(() => {
      result.current.addToCart(product);
    });
    act(() => {
      result.current.removeFromCart(product.id);
    });

    expect(result.current.items).toEqual([]);
  });

  it("clearCart vacía todo el carrito", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(buildProduct({ id: "a" }));
      result.current.addToCart(buildProduct({ id: "b" }));
    });
    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
  });
});
