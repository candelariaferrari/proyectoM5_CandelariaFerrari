import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { ToastProvider } from "../src/contexts/ToastContext";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ProductsProvider } from "../src/contexts/ProductsContext";
import { CartProvider } from "../src/contexts/CartContext";
import { OrdersProvider } from "../src/contexts/OrdersContext";
import { Toast } from "../src/components/ui/Toast";

// Arma el mismo árbol de providers que usa la app real pero con MemoryRouter en vez de BrowserRouter, para
// poder elegir con qué URL "arranca" cada test sin depender de window.location.
//
// AuthProvider y ProductsProvider hacen pedidos a Firebase en su
// useEffect: eso está mockeado de forma global en test/setupTests.ts 
export const renderWithProviders = (ui: ReactElement, { route = "/" }: { route?: string } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ToastProvider>
        <AuthProvider>
          <OrdersProvider>
            <ProductsProvider>
              <CartProvider>
                {ui}
                <Toast />
              </CartProvider>
            </ProductsProvider>
          </OrdersProvider>
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );
};
