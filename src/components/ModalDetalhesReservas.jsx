import React from 'react';
import { useNavigate } from 'react-router-dom';

// Funções de formatação (sem alterações)
const formatarData = (dataString) => {
  if (!dataString) return 'Data indisponível';
  const data = new Date(dataString);
  data.setDate(data.getDate() + 1);
  return new Intl.DateTimeFormat('pt-BR').format(data);
};

const formatarValor = (valor) => {
  if (valor == null) return 'Valor indisponível';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

const ModalDetalhesReservas = ({ reserva, onClose }) => {
  const navigate = useNavigate();

  if (!reserva) {
    return null;
  }

  const handlePagar = () => {
    onClose();
    navigate(`/pagamento/${reserva.id}`);
  };

  const statusReservaMap = {
    PENDENTE: { text: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
    CONFIRMADO: { text: 'Confirmada', className: 'bg-blue-100 text-blue-800' },
    CONCLUIDA: { text: 'Concluída', className: 'bg-green-100 text-green-800' },
    CANCELADO: { text: 'Cancelada', className: 'bg-red-100 text-red-800' },
  };

  const statusPagamentoMap = {
    PENDENTE: { text: 'Aguardando Pagamento', className: 'text-yellow-600' },
    CONFIRMADO: { text: 'Pagamento Aprovado', className: 'text-green-600' },
    CONCLUIDA: { text: 'Pagamento Aprovado', className: 'text-green-600' },
    CANCELADO: { text: 'Cancelado', className: 'text-red-600' },
  };

  const reservaStatusInfo = statusReservaMap[reserva.status] || {
    text: reserva.status,
    className: 'bg-gray-100 text-gray-800',
  };
  const pagamentoStatusInfo = statusPagamentoMap[reserva.status] || {
    text: 'Indisponível',
    className: 'text-gray-500',
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Detalhes da Reserva</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            {/* Ícone de fechar */}
          </button>
        </div>

        {/* Corpo */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Destino</p>
            <p className="font-semibold text-lg text-gray-900">{reserva.pacoteViagem?.destino}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Data da Viagem</p>
              <p className="font-semibold text-gray-700">{formatarData(reserva.data)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Valor Total</p>
              <p className="font-semibold text-gray-700">{formatarValor(reserva.valorTotal)}</p>
            </div>
          </div>

          {/* 2. Seção de Status (Reserva e Pagamento) */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Status da Reserva</p>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${reservaStatusInfo.className}`}
              >
                {reservaStatusInfo.text}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status do Pagamento</p>
              <p className={`font-semibold ${pagamentoStatusInfo.className}`}>
                {pagamentoStatusInfo.text}
              </p>
            </div>
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

        {/* Rodapé */}
        <div className="border-t border-gray-200 pt-4 mt-6 flex justify-end items-center">
          {reserva.status === 'PENDENTE' && (
            <button
              onClick={handlePagar}
              className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
            >
              Realizar Pagamento
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesReservas;
