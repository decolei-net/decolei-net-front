import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ paginaAtual, totalPaginas, onPageChange }) {
    if (totalPaginas <= 1) {
        return null; // Não mostra a paginação se houver apenas uma página
    }

    return (
        <div className="flex items-center justify-center space-x-4 mt-10">
            <button
                onClick={() => onPageChange(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={16} className="mr-2" />
                Anterior
            </button>
            <span className="text-sm text-gray-700">
                Página {paginaAtual} de {totalPaginas}
            </span>
            <button
                onClick={() => onPageChange(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Próximo
                <ChevronRight size={16} className="ml-2" />
            </button>
        </div>
    );
}
