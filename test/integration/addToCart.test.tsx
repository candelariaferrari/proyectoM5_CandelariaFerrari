import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ToastProvider } from "../../src/contexts/ToastContext";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { ProductsProvider } from "../../src/contexts/ProductsContext";
import { CartProvider } from "../../src/contexts/CartContext";
import { ProductDetailPage } from "../../src/pages/ProductDetailPage";
import { CartPage } from "../../src/pages/CartPage";
import { Toast } from "../../src/components/ui/Toast";
import { buildProduct } from "../fixtures";

// Mockeamos el service (no Firestore de bajo nivel): a este test le
// interesa "si pido el producto X, lo tengo que poder agregar al carrito y
// verlo reflejado en /carrito", no cómo se arma la query de Firestore.
const product = buildProduct({ id: "product-1", name: "Rompecabezas Mundo", price: 5000, stock: 10 });

// ProductsProvider (useProductsPagination) también vive en este árbol de
// providers y pide productos apenas se monta: hay que mockear también
// listProducts/countProducts (vacío) para que no explote, aunque este test
// no use el catálogo paginado para nada.
vi.mock("../../src/services/products.services", () => ({
  getProductsById: vi.fn(async () => product),
  listProducts: vi.fn(async () => ({ products: [], nextCursor: null })),
  countProducts: vi.fn(async () => 0),
}));

// Test de integración: simula el flujo completo "ver un producto -> agregar
// al carrito -> ver el carrito actualizado", igual que lo haría una
// persona usuaria real, usando las páginas reales (no versiones de
// prueba) sobre el árbol completo de providers.
const renderFlow = () =>
  render(
    <MemoryRouter initialEntries={["/producto/product-1"]}>
      <ToastProvider>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <Routes>
                <Route
                  path="/producto/:id"
                  element={
                    <>
                      <ProductDetailPage />
                      {/* Link de ayuda, solo para este test: en la app real
                          se navega al carrito desde el Header. */}
                      <Link to="/carrito">Ir al carrito (test)</Link>
                    </>
                  }
                />
                <Route path="/carrito" element={<CartPage />} />
              </Routes>
              {/* En la app real, <Toast /> se monta en App.tsx, afuera de
                  las rutas (ver App.tsx). Acá hay que montarlo a mano para
                  que el toast de "agregado al carrito" se vea en el DOM. */}
              <Toast />
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );

describe("integración: agregar al carrito", () => {
  it("agrega un producto desde el detalle y aparece en /carrito", async () => {
    renderFlow();

    // Espera a que termine de "cargar" el producto (getProductsById mockeado)
    const addButton = await screen.findByRole("button", { name: /agregar al carrito/i });
    fireEvent.click(addButton);

    // Confirma el toast de éxito
    expect(await screen.findByText('"Rompecabezas Mundo" agregado al carrito')).toBeInTheDocument();

    // Navega al carrito y confirma que el producto está ahí, con su precio
    fireEvent.click(screen.getByRole("link", { name: "Ir al carrito (test)" }));

    await waitFor(() => {
      expect(screen.getByText("Rompecabezas Mundo")).toBeInTheDocument();
    });
    expect(screen.getByText("Tu carrito (1)")).toBeInTheDocument();
  });
});
