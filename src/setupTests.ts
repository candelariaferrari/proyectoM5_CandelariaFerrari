// Extiende `expect` de Vitest con los matchers de jest-dom
// (toBeInTheDocument, toHaveTextContent, etc.), y limpia el DOM
// entre tests para que no se pisen entre sí.
import "@testing-library/jest-dom/vitest";
