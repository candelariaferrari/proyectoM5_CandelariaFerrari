import { Routes, Route } from "react-router-dom";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";

export const AppRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="/producto/:id" element={<ProductDetailPage />} />
    </Routes>
  );
};
