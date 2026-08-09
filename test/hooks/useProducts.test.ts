import { renderHook } from "@testing-library/react";
import { useProducts } from "../../src/hooks/useProducts";
import { test, expect } from "vitest";

test("useProducts lanza error si se usa fuera de ProductsProvider", () => {
  expect(() => renderHook(() => useProducts())).toThrow(
    "useProducts debe utilizarse dentro de un ProductsProvider"
  );
});