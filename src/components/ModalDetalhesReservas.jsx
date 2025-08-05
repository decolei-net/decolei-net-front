import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Users, DollarSign, CheckCircle, Clock } from 'lucide-react';

// --- Funções Auxiliares de Formatação ---
const formatarData = (dataString) => {
  if (!dataString) return 'Data indisponível';
  try {
    // Usamos timeZone UTC para consistência com o que é exibido no dashboard
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(dataString));
  } catch (error) {
    return 'Data inválida';
  }
};

const formatarValor = (valor) => {
  if (valor == null) return 'Valor indisponível';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

export default function ModalDetalhesReservas({ reserva, onClose }) {
  const navigate = useNavigate();

  if (!reserva) {
    return null;
  }

  const handlePagar = () => {
    onClose(); // Fecha o modal antes de navegar
    navigate(`/pagamento/${reserva.id}`);
  };

  // --- Mapeamento de Status para UI ---
  const statusReservaMap = {
    PENDENTE: { text: 'Pendente', icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
    CONFIRMADA: { text: 'Confirmada', icon: CheckCircle, className: 'bg-blue-100 text-blue-800' },
    CONCLUIDA: { text: 'Concluída', icon: CheckCircle, className: 'bg-green-100 text-green-800' },
    CANCELADA: { text: 'Cancelada', icon: X, className: 'bg-red-100 text-red-800' },
  };

  const statusPagamentoMap = {
    PENDENTE: { text: 'Aguardando Pagamento', className: 'text-yellow-600' },
    APROVADO: { text: 'Pagamento Aprovado', className: 'text-green-600' },
    RECUSADO: { text: 'Pagamento Recusado', className: 'text-red-600' },
  };

  const reservaStatusInfo = statusReservaMap[reserva.status] || {
    text: reserva.status,
    icon: Clock,
    className: 'bg-gray-100 text-gray-800',
  };
  const StatusIcon = reservaStatusInfo.icon;

  // Usa o campo 'reserva_StatusPagamento' que vem da API
  const pagamentoStatusInfo = statusPagamentoMap[reserva.reserva_StatusPagamento] || {
    text: 'Indisponível',
    className: 'text-gray-500',
  };

  return (
    // Fundo do modal com evento de fechar
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
    >
      {/* Conteúdo do Modal */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <h2 id="modal-heading" className="text-2xl font-bold text-gray-800">Detalhes da Reserva</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Fechar modal">
            <X size={24} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-500">Pacote</p>
            <p className="font-semibold text-xl text-gray-900 mb-4">{reserva.pacoteViagem?.titulo}</p>
            <p className="text-sm text-gray-500">Destino</p>
            <p className="font-semibold text-xl text-gray-900">{reserva.pacoteViagem?.destino}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 flex items-center"><Calendar size={14} className="mr-2" /> Período da Viagem</p>
              <p className="font-medium text-gray-700">{formatarData(reserva.pacoteViagem?.dataInicio)} - {formatarData(reserva.pacoteViagem?.dataFim)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center"><Users size={14} className="mr-2" /> Viajantes</p>
              <p className="font-semibold text-gray-700">{reserva.viajantes.length + 1}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Status da Reserva</p>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center w-fit ${reservaStatusInfo.className}`}>
                <StatusIcon size={14} className="mr-2" />
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

          <div>
            <p className="text-sm text-gray-500 flex items-center"><DollarSign size={14} className="mr-2" /> Valor Total</p>
            <p className="font-semibold text-2xl text-blue-600">{formatarValor(reserva.valorTotal)}</p>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="border-t border-gray-200 pt-4 mt-6 flex justify-end items-center">
          {reserva.status === 'PENDENTE' && (
            <button
              onClick={handlePagar}
              className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
            >
              Realizar Pagamento
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg transition ${reserva.status === 'PENDENTE' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 ml-4' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
