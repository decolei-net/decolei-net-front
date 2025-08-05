import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

/**
 * Gera os números de página a serem exibidos, adicionando reticências para longas listas.
 * @param {number} paginaAtual A página atualmente ativa.
 * @param {number} totalPaginas O número total de páginas.
 * @returns {(number | string)[]} Um array de números e/ou strings de reticências.
 */
const gerarNumerosPaginacao = (paginaAtual, totalPaginas) => {
  // Se houver 7 páginas ou menos, mostra todos os números.
  if (totalPaginas <= 7) {
    return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  }

  // Lógica para listas longas: mostra o início, o fim, e as páginas ao redor da atual.
  // Exemplo: [1, '...', 4, 5, 6, '...', 10]
  if (paginaAtual <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPaginas];
  }
  if (paginaAtual >= totalPaginas - 3) {
    return [
      1,
      '...',
      totalPaginas - 4,
      totalPaginas - 3,
      totalPaginas - 2,
      totalPaginas - 1,
      totalPaginas,
    ];
  }
  return [1, '...', paginaAtual - 1, paginaAtual, paginaAtual + 1, '...', totalPaginas];
};

export default function Pagination({ paginaAtual, totalPaginas, onPageChange }) {
  if (totalPaginas <= 1) {
    return null; // Não mostra a paginação se houver apenas uma página.
  }

  const paginasParaMostrar = gerarNumerosPaginacao(paginaAtual, totalPaginas);

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Botão Anterior */}
      <button
        onClick={() => onPageChange(paginaAtual - 1)}
        disabled={paginaAtual === 1}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-300"
        aria-label="Página Anterior"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      {/* Números das Páginas */}
      <div className="flex items-center gap-1">
        {paginasParaMostrar.map((pagina, index) => {
          // Se for reticências, mostra um ícone
          if (typeof pagina === 'string') {
            return (
              <div key={`ellipsis-${index}`} className="flex items-center justify-center w-10 h-10">
                <MoreHorizontal size={16} className="text-gray-400" />
              </div>
            );
          }

          // Se for um número, mostra um botão
          const isCurrent = pagina === paginaAtual;
          return (
            <button
              key={pagina}
              onClick={() => onPageChange(pagina)}
              disabled={isCurrent}
              className={`flex items-center justify-center w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                isCurrent
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110 cursor-default'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 hover:scale-105 shadow-sm'
              }`}
              aria-label={`Ir para página ${pagina}`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {pagina}
            </button>
          );
        })}
      </div>

      {/* Botão Próximo */}
      <button
        onClick={() => onPageChange(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-300"
        aria-label="Próxima Página"
      >
        <span className="hidden sm:inline">Próxima</span>
        <ChevronRight size={16} />
      </button>

      {/* Informações da Página (Mobile) */}
      <div className="sm:hidden ml-4 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
        {paginaAtual} de {totalPaginas}
      </div>
    </div>
  );
}
