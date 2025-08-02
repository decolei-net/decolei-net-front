import React from 'react';
import { useNavigate } from 'react-router-dom';
// ✅ 1. Importando ícones modernos
import {
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const ClienteResumoCard = ({ cliente }) => {
  const navigate = useNavigate();

  if (!cliente) return null;

  // Função para navegar para a página de detalhes do cliente
  const handleVerDetalhes = () => {
    navigate(`/dashboard-atendente/detalhes-clientes/${cliente.id}`);
  };

  return (
    // ✅ 2. Layout do card aprimorado com hover e transição
    <div
      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300 cursor-pointer"
      onClick={handleVerDetalhes}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <UserCircleIcon className="h-12 w-12 text-gray-300" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-800">{cliente.nomeCompleto}</h4>
          {/* ✅ 3. Detalhes com ícones e melhor espaçamento */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-500 mt-1">
            <div className="flex items-center gap-1.5">
              <EnvelopeIcon className="h-4 w-4" />
              <span>{cliente.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PhoneIcon className="h-4 w-4" />
              <span>{cliente.telefone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IdentificationIcon className="h-4 w-4" />
              <span>{cliente.documento || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="ml-4">
        <button
          onClick={handleVerDetalhes}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default ClienteResumoCard;
