import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const ClienteResumoCard = ({ cliente }) => {
  const navigate = useNavigate();
  if (!cliente) return null;

  const handleVerDetalhes = (e) => {
    e.stopPropagation(); // Evita conflito se clicar no botão e no card
    navigate(`/dashboard-atendente/detalhes-clientes/${cliente.id}`);
  };

  return (
    <div
      className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300 cursor-pointer"
      onClick={handleVerDetalhes}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Bloco de informações */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <UserCircleIcon className="h-12 w-12 text-gray-300" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-800 break-words">{cliente.nomeCompleto}</h4>
            <div className="mt-1 space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4" />
                <span>{cliente.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                <span>{cliente.telefone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <IdentificationIcon className="h-4 w-4" />
                <span>{cliente.documento || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de detalhes */}
        <div className="sm:self-start">
          <button
            onClick={handleVerDetalhes}
            className="text-sm font-semibold text-blue-600 hover:underline mt-2 sm:mt-0"
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClienteResumoCard;
