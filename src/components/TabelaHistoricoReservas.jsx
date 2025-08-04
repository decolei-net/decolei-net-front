import React from 'react';

export default function TabelaHistoricoReservas({ reservas }) {
  return (
    <tbody>
      {reservas.map((reserva, index) => (
        <tr key={index} className="border-t hover:bg-gray-50">
          <td className="px-4 py-3">{reserva.pacote}</td>
          <td className="px-4 py-3">{reserva.dataInicio} – {reserva.dataFim}</td>
          <td className={`px-4 py-3 font-semibold ${getStatusColor(reserva.statusReserva)}`}>
            {reserva.statusReserva}
          </td>
          <td className={`px-4 py-3 font-semibold ${getStatusColor(reserva.statusPagamento)}`}>
            {reserva.statusPagamento}
          </td>
        </tr>
      ))}
    </tbody>
  );
}

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'confirmada':
    case 'aprovado':
    case 'confirmado':
      return 'text-green-600';
    case 'pendente':
      return 'text-yellow-600';
    case 'cancelada':
    case 'rejeitado':
    case 'cancelado':
      return 'text-red-500';
    default:
      return 'text-gray-800';
  }
};
