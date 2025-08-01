import React from 'react';

// A prop "onVerDetalhes" agora receberá a função de navegação
const TabelaReservasBusca = ({ reservas, onVerDetalhes }) => {
  const formatarData = (data) => {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
            <th className="p-3">Destino</th>
            <th className="p-3">Cliente</th>
            <th className="p-3">Data da Reserva</th>
            <th className="p-3">Status</th>
            <th className="p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{reserva.pacoteViagem?.destino || 'Destino não informado'}</td>
              <td className="p-3">{reserva.usuario?.nomeCompleto || 'Usuário não encontrado'}</td>
              <td className="p-3">{formatarData(reserva.data)}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full
                  ${reserva.status === 'PENDENTE' ? 'bg-yellow-200 text-yellow-800' : ''}
                  ${reserva.status === 'CONFIRMADO' ? 'bg-blue-200 text-blue-800' : ''}
                  ${reserva.status === 'CONCLUIDA' ? 'bg-green-200 text-green-800' : ''}
                  ${reserva.status === 'CANCELADO' ? 'bg-red-200 text-red-800' : ''}`}
                >
                  {reserva.status}
                </span>
              </td>
              <td className="p-3">
                <button
                  onClick={() => onVerDetalhes(reserva)}
                  className="bg-[rgb(0,84,161)] text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                  Detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {reservas.length === 0 && (
        <p className="text-center text-gray-500 py-4">Nenhuma reserva encontrada.</p>
      )}
    </div>
  );
};

export default TabelaReservasBusca;
