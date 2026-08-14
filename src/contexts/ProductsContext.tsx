import { createContext, useEffect, useMemo, useState } from "react";
import type { Product } from "../types/product.types";
import { getProducts } from "../services/products.services";

interface ProductsContextType {
  products: Product[];
  loading: boolean; //si esta en true voy a consutlar los datos, si viene en false es que ya busco
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
  //const DEFAULT_PRODUCT_IMAGE = "https://www.freeiconspng.com/img/2114";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    getProducts() //mapeaba y le agrega el id 
    .then(setProducts)
    .finally(()=> setLoading(false)) //cambia el loading a false porque ya termino la consulta
  },[]);

  const value = useMemo(()=> //para que no altere si nohay cambios
    ({products, loading}),[products,loading]);

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

