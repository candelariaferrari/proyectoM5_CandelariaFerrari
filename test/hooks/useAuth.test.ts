import { renderHook } from "@testing-library/react";
import { useAuth } from "../../src/hooks/useAuth";
import { test, expect } from "vitest";

test("useAuth lanza error si se usa fuera de AuthProvider", () => {
  expect(() => renderHook(() => useAuth())).toThrow(
    "useAuth debe utilizarse dentro de un AuthProvider"
  );
});