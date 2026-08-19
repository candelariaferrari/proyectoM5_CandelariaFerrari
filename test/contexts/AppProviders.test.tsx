import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppProviders } from "../../src/contexts/AppProviders";

// AppProviders es pura composición del árbol de providers que arma la app real
// solo confirma que el árbol completo se puede montar sin explotar y que efectivamente
// deja pasar a los children 
describe("AppProviders", () => {
  it("monta el árbol completo de providers sin explotar y renderiza los children", async () => {
    render(
      <AppProviders>
        <p>Contenido de prueba</p>
      </AppProviders>
    );

    expect(await screen.findByText("Contenido de prueba")).toBeInTheDocument();
  });
});
