import React from 'react';

// Funções de formatação
const formatarData = (dataString) => {
  if (!dataString) return 'Data indisponível';
  const data = new Date(dataString);
  data.setDate(data.getDate() + 1); // Ajuste de fuso horário
  return new Intl.DateTimeFormat('pt-BR').format(data);
};

const formatarValor = (valor) => {
  if (valor == null) return 'Valor indisponível';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

const ModalDetalhesReservas = ({ reserva, onClose }) => {
  if (!reserva) {
    return null;
  }

  // Mapeamento de status para classes de cor do Tailwind
  const statusClasses = {
    PENDENTE: 'bg-yellow-100 text-yellow-800',
    CONCLUIDA: 'bg-green-100 text-green-800',
    // Adicione outros status se necessário
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Conteúdo */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Detalhes da Reserva</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Corpo */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Destino</p>
            <p className="font-semibold text-lg text-gray-900">{reserva.pacoteViagem?.destino}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Data da Viagem</p>
              <p className="font-semibold text-gray-700">{formatarData(reserva.data)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Valor Total</p>
              <p className="font-semibold text-gray-700">{formatarValor(reserva.valorTotal)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${statusClasses[reserva.status] || 'bg-gray-100 text-gray-800'}`}
              >
                {reserva.status}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Número da Reserva</p>
            <p className="font-mono text-gray-700">{reserva.numero}</p>
          </div>

          {/* Viajantes */}
          <div>
            <h4 className="font-bold text-gray-800 mt-6 border-t border-gray-200 pt-4">
              Viajantes
            </h4>
            <ul className="mt-2 space-y-2">
              {reserva.viajantes?.map((viajante, index) => (
                <li key={index} className="bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-500">
                  <p className="font-semibold text-gray-800">{viajante.nome}</p>
                  <p className="text-sm text-gray-600">Documento: {viajante.documento}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesReservas;
