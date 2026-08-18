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

  // Si llegamos con ?categoria=x en la URL (por ej. desde una tile de la Home),
  // lo aplicamos al Context al entrar a la página.
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

  // Precio: se filtra en el cliente sobre la página actual que ya trajo el
  // Context (evita un índice compuesto nuevo en Firestore por un filtro
  // tan simple). Como consecuencia, si hay un precio cargado, esta página
  // puede mostrar menos productos que el resto -- es un recorte extra
  // sobre una página ya paginada del lado del servidor, no un total nuevo.
  const filteredProducts = products.filter((product) => {
    const min = priceMin ? Number(priceMin) : 0;
    const max = priceMax ? Number(priceMax) : Infinity;
    return product.price >= min && product.price <= max;
  });

  const hasPriceFilter = priceMin !== "" || priceMax !== "";

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-6 grid gap-8 md:grid-cols-[220px_1fr]">
      <CategoryFilterSidebar
        categoryFilter={categoryFilter}
        onSelectCategory={handleSelectCategory}
        priceMin={priceMin}
        priceMax={priceMax}
        onPriceMinChange={setPriceMin}
        onPriceMaxChange={setPriceMax}
        onClearFilters={handleClearFilters}
      />
      <div>
        <h2 className="font-heading font-extrabold text-lg text-azul-noche mb-3">
          Todos los juguetes{" "}
          <span className="text-sm font-normal text-azul-noche/50">
            {hasPriceFilter ? `${filteredProducts.length} en esta página` : `${totalCount} resultado(s)`}
          </span>
        </h2>
        <ProductGrid products={filteredProducts} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => (page > currentPage ? goToNextPage() : goToPreviousPage())}
        />
      </div>
    </section>
  );
};
