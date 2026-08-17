import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { ProductsProvider } from "./ProductsContext";
import { CartProvider } from "./CartContext";
import { ToastProvider } from "./ToastContext";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>{children}</CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};