import { renderHook, act } from "@testing-library/react";
import { test, expect } from "vitest";
import type { ReactNode } from "react";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { CartProvider } from "../../src/contexts/CartContext";
import { useAuth } from "../../src/hooks/useAuth";
import { useCart } from "../../src/hooks/useCart";
import type { Product } from "../../src/types/product.types";

// Producto de prueba inventado
const mockProduct: Product = {
  id: "p1",
  name: "Zapatillas Runner Pro",
  description: "Producto de prueba para el test",
  price: 100,
  stock: 10,
  category: "Calzado",
  rating: { rate: 4.5, count: 10 },
};

// Envuelve el hook bajo test con los dos providers necesarios.
const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <CartProvider>{children}</CartProvider>
  </AuthProvider>
);

test("el carrito de invitado y el de un usuario logueado están separados", () => {
  const { result } = renderHook(
    () => ({ auth: useAuth(), cart: useCart() }),
    { wrapper } //componente invisible que llama a los 2 hooks 
  );

  // Como invitado, agrega un producto al carrito
  act(() => {
    result.current.cart.addToCart(mockProduct);
  });
  expect(result.current.cart.items).toHaveLength(1);

  // Se loguea
  act(() => { //es una regla de Testing Library para que React termine de procesar el cambio antes de que vos revises el resultado.
    result.current.auth.login("customer");
  });

  // El carrito del usuario logueado es otro carrito (vacío), no el de invitado
  expect(result.current.cart.items).toHaveLength(0);
});