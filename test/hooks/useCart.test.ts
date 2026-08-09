import { renderHook } from "@testing-library/react";
import { useCart } from "../../src/hooks/useCart";
import { test, expect } from "vitest";

test("useCart lanza error si se usa fuera de CartProvider", () => {
  expect(() => renderHook(() => useCart())).toThrow(
    "useCart debe utilizarse dentro de un CartProvider"
  );
});