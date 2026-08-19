// Precios en toda la app se formatean igual 
export const formatCurrency = (amount: number): string => `$${amount.toLocaleString("es-AR")}`;
