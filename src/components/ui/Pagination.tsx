//presentacional
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-4 mt-4">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-sm font-bold text-azul-noche border border-gris-borde rounded-pill px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      <span className="text-sm text-azul-noche/70">
        Página {currentPage} de {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-sm font-bold text-azul-noche border border-gris-borde rounded-pill px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </div>
  );
};
