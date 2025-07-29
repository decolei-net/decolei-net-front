// src/pages/Unauthorized.jsx

import { Link } from 'react-router-dom';
import { Ban } from 'lucide-react'; // Ícone de "proibido"

export default function Unauthorized() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100 p-4">
            <Ban className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-4xl font-bold text-gray-800">Acesso Negado</h1>
            <p className="mt-2 text-lg text-gray-600">
                Você não tem permissão para visualizar esta página.
            </p>
            <Link 
                to="/" 
                className="mt-6 px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
                Voltar para a Página Inicial
            </Link>
        </div>
    );
}