// Fuente única del umbral de "stock bajo": lo usan tanto el badge de
// stock en AdminProductsPage como la sección "Stock a revisar" del
// dashboard, y no tiene sentido que cada uno tenga su propio número
// mágico que se pueda desincronizar.
export const LOW_STOCK_THRESHOLD = 5;
