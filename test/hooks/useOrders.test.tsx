import type { ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useOrders } from "../../src/hooks/useOrders";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { OrdersProvider } from "../../src/contexts/OrdersContext";

// Wrapper mínimo
const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <OrdersProvider>{children}</OrdersProvider>
  </AuthProvider>
);

describe("useOrders", () => {
  it("explota si se usa fuera de un OrdersProvider (guard clause)", () => {
    // Sin wrapper: no hay OrdersContext disponible.
    expect(() => renderHook(() => useOrders())).toThrow(
      "useOrders debe utilizarse dentro de un OrdersProvider"
    );
  });

  it("sin usuario logueado, empieza con orders vacío y sin loading colgado", () => {
    const { result } = renderHook(() => useOrders(), { wrapper });

    expect(result.current.orders).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(false);
  });
});
