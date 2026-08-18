import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { ProductsProvider } from "./ProductsContext";
import { CartProvider } from "./CartContext";
import { ToastProvider } from "./ToastContext";
import { OrdersProvider } from "./OrdersContext";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <OrdersProvider>
            <ProductsProvider>
              <CartProvider>{children}</CartProvider>
            </ProductsProvider>
          </OrdersProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};
