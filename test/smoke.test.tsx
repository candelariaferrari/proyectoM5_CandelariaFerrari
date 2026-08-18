import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "./renderWithProviders";
import { CartPage } from "../src/pages/CartPage";

// Smoke test: monta una página real dentro del árbol completo de
// providers (Toast + Auth + Products + Cart, todos con Firebase mockeado)
// y confirma que no explota nada al renderizar y que se ve el contenido
// esperado. Sirve como red de seguridad barata: si alguien rompe el
// wrapper de providers, o algún import queda mal (como pasó con el import
// de Link en CartPage), este test lo detecta.
describe("smoke: árbol de providers", () => {
  it("renderiza CartPage sin explotar, con el carrito vacío por defecto", () => {
    renderWithProviders(<CartPage />, { route: "/carrito" });

    expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument();
  });
});
