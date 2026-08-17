import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutConfirmPage } from "../pages/CheckoutConfirmPage";
import { CustomerOrdersPage } from "../pages/CustomerOrdersPage";
import { OrderConfirmationPage } from "../pages/OrderConfirmationPage";
import { AdminLayout } from "../components/admin/AdminLayout";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminProductsPage } from "../pages/admin/AdminProductsPage";
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/productos" element={<ProductsPage />} />
      <Route path="/producto/:id" element={<ProductDetailPage />} />
      <Route path="/carrito" element={<CartPage />} />
      <Route
        path="/confirmar-compra"
        element={
          <ProtectedRoute>
            <CheckoutConfirmPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pedidos"
        element={
          <ProtectedRoute>
            <CustomerOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pedido-confirmado"
        element={
          <ProtectedRoute>
            <OrderConfirmationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="productos" element={<AdminProductsPage />} />
        <Route path="ordenes" element={<AdminOrdersPage />} />
      </Route>
    </Routes>
  );
};
