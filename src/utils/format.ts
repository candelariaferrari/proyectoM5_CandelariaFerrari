// Precios en toda la app se formatean igual (separador de miles con punto,
// sin decimales, sin símbolo de moneda propio) -- estaba repetido como
// `${valor.toLocaleString("es-AR")}` en más de 15 lugares distintos.
export const formatCurrency = (amount: number): string => `$${amount.toLocaleString("es-AR")}`;
