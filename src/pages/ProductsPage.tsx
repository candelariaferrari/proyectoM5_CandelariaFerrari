import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "../components/products/ProductGrid";
import { CategoryFilterSidebar } from "../components/products/CategoryFilterSidebar";
import { useProducts } from "../hooks/useProducts";
import type { CategoryId } from "../types/product.types";
import { CATEGORY_IDS } from "../constants/categories";
import { Pagination } from "../components/ui/Pagination";

export const ProductsPage = () => {
  const {
    products,
    categoryFilter,
    setCategoryFilter,
    setSearchTerm,
    currentPage,
    totalPages,
    totalCount,
    goToNextPage,
    goToPreviousPage,
  } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  //Lee ?categoria= de la URL al entrar (para soportar llegar desde un link de CategoryTiles) y lo aplica al contexto.
  useEffect(() => {
    const fromUrl = searchParams.get("categoria");
    if (fromUrl && CATEGORY_IDS.includes(fromUrl as CategoryId)) {
      setCategoryFilter(fromUrl as CategoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectCategory = (category: CategoryId | null) => {
    setSearchTerm(""); // la categoría manda acá; si había una búsqueda activa, la descartamos
    setCategoryFilter(category);
    setSearchParams(category ? { categoria: category } : {});
  };

  const handleClearFilters = () => {
    handleSelectCategory(null);
    setPriceMin("");
    setPriceMax("");
  };

  // Precio: se filtra del lado del cliente, no hice indice compuesto
  const filteredProducts = products.filter((product) => {
    const min = priceMin ? Number(priceMin) : 0;
    const max = priceMax ? Number(priceMax) : Infinity;
    return product.price >= min && product.price <= max;
  });

  const hasPriceFilter = priceMin !== "" || priceMax !== "";

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-6 grid gap-8 md:grid-cols-[220px_1fr] md:h-full md:min-h-0">
      <CategoryFilterSidebar
        categoryFilter={categoryFilter}
        onSelectCategory={handleSelectCategory}
        priceMin={priceMin}
        priceMax={priceMax}
        onPriceMinChange={setPriceMin}
        onPriceMaxChange={setPriceMax}
        onClearFilters={handleClearFilters}
      />
      <div className="md:flex md:flex-col md:h-full md:min-h-0">
        <h2 className="font-heading font-extrabold text-lg text-azul-noche mb-3 md:shrink-0">
          Todos los juguetes{" "}
          <span className="text-sm font-normal text-azul-noche/50">
            {hasPriceFilter ? `${filteredProducts.length} en esta página` : `${totalCount} resultado(s)`}
          </span>
        </h2>
       
        <div className="md:flex-1 md:overflow-y-auto md:min-h-0 md:pr-1">
          <ProductGrid products={filteredProducts} />
        </div>
        <div className="md:shrink-0">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => (page > currentPage ? goToNextPage() : goToPreviousPage())}
          />
        </div>
      </div>
    </section>
  );
};
