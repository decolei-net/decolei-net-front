import React from 'react';

const TabelaReservasBusca = ({ reservas, onVerDetalhes }) => {
  const formatarData = (data) => {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[600px] w-full bg-white border border-gray-200 rounded shadow-sm">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
            <th className="px-4 py-3">Destino</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Data da Reserva</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id} className="border-t hover:bg-gray-50 text-sm">
              <td className="px-4 py-3 whitespace-nowrap">
                {reserva.pacoteViagem?.destino || 'Destino não informado'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {reserva.usuario?.nomeCompleto || 'Usuário não encontrado'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatarData(reserva.data)}
              </td>
              <td className="px-4 py-3">
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
              <td className="px-4 py-3">
                <button
                  onClick={() => onVerDetalhes(reserva)}
                  className="bg-[rgb(0,84,161)] text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-xs font-semibold"
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
