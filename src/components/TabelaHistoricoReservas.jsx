import React from 'react';

export default function TabelaHistoricoReservas({ reservas }) {
  return (
    <table className="min-w-full bg-white shadow border rounded">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left font-semibold text-gray-700">Pacote</th>
          <th className="px-6 py-3 text-left font-semibold text-gray-700">Datas</th>
          <th className="px-6 py-3 text-left font-semibold text-gray-700">Status Reserva</th>
          <th className="px-6 py-3 text-left font-semibold text-gray-700">Status Pagamento</th>
        </tr>
      </thead>
      <tbody>
        {reservas.map((reserva, index) => (
          <tr key={index} className="border-t">
            <td className="px-6 py-4">{reserva.pacote}</td>
            <td className="px-6 py-4">{reserva.dataInicio} – {reserva.dataFim}</td>
            <td className={`px-6 py-4 font-semibold ${getStatusColor(reserva.statusReserva)}`}>
              {reserva.statusReserva}
            </td>
            <td className={`px-6 py-4 font-semibold ${getStatusColor(reserva.statusPagamento)}`}>
              {reserva.statusPagamento}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'confirmada':
    case 'aprovado':
      return 'text-green-600';
    case 'pendente':
      return 'text-yellow-600';
    case 'cancelada':
    case 'rejeitado':
      return 'text-red-500';
    default:
      return 'text-gray-800';
  }
};
