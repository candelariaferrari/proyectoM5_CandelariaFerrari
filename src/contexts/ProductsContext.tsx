import { createContext, useState } from "react";
import type { Product } from "../types/product.types";

interface ProductsContextType {
  products: Product[];
}
// eslint-disable-next-line react-refresh/only-export-components
export const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

export const ProductsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const DEFAULT_PRODUCT_IMAGE = "https://www.freeiconspng.com/img/2114";

  const [products] = useState<Product[]>([
  {
    id: "1",
    name: "Adidas Ultraboost",
    imageUrl: DEFAULT_PRODUCT_IMAGE,
    description: "Zapatillas deportivas Adidas para running",
    price: 180,
    stock: 8,
    category: "Calzado",
    rating: {
      rate: 4.5,
      count: 120,
    },
  },
  {
    id: "2",
    name: "Nike Air Max",
    imageUrl: DEFAULT_PRODUCT_IMAGE,
    description: "Zapatillas deportivas Nike para entrenamiento",
    price: 220,
    stock: 15,
    category: "Calzado",
    rating: {
      rate: 4.8,
      count: 250,
    },
  },
]);
  return (
    <ProductsContext.Provider value={{ products, }}>
      {children}
    </ProductsContext.Provider>
  )
}

