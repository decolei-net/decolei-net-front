import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        return [1, '...', totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas];
    }
    return [1, '...', paginaAtual - 1, paginaAtual, paginaAtual + 1, '...', totalPaginas];
};

export default function Pagination({ paginaAtual, totalPaginas, onPageChange }) {
    if (totalPaginas <= 1) {
        return null; // Não mostra a paginação se houver apenas uma página.
    }

    const paginasParaMostrar = gerarNumerosPaginacao(paginaAtual, totalPaginas);

    return (
        <div className="flex items-center justify-center space-x-2 mt-10">
            {/* Botão Anterior */}
            <button
                onClick={() => onPageChange(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página Anterior"
            >
                <ChevronLeft size={16} />
            </button>

            {/* Números das Páginas */}
            <div className="flex items-center space-x-2">
                {paginasParaMostrar.map((pagina, index) => {
                    // Se for reticências, mostra um texto simples
                    if (typeof pagina === 'string') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-2 py-1 text-sm text-gray-500">
                                {pagina}
                            </span>
                        );
                    }

                    // Se for um número, mostra um botão
                    const isCurrent = pagina === paginaAtual;
                    return (
                        <button
                            key={pagina}
                            onClick={() => onPageChange(pagina)}
                            disabled={isCurrent}
                            className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                                isCurrent
                                    ? 'bg-blue-600 text-white cursor-default'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                            }`}
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
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Próxima Página"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
