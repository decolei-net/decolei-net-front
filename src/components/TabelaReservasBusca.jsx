import React from 'react';
import { useNavigate } from 'react-router-dom';

const TabelaReservasBusca = ({ reservas }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100 text-gray-700 text-left text-sm uppercase">
          <tr>
            <th className="px-6 py-3">ID Reserva</th>
            <th className="px-6 py-3">Cliente</th>
            <th className="px-6 py-3">Pacote</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r) => (
            <tr
              key={r.id}
              className="border-t hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 font-medium text-gray-900">#{r.id}</td>
              <td className="px-6 py-4">{r.usuario?.nomeCompleto || '—'}</td>
              <td className="px-6 py-4">{r.pacoteViagem?.destino || '—'}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${
                    r.status === 'CONFIRMADO'
                      ? 'bg-green-600'
                      : r.status === 'PENDENTE'
                      ? 'bg-yellow-500'
                      : r.status === 'CANCELADO'
                      ? 'bg-red-500'
                      : 'bg-gray-400'
                  }`}
                >
                  {r.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => {
                    console.log('ID do usuário ao clicar em "Ver Detalhes":', r.usuario?.id);
                    navigate(`/dashboard-atendente/detalhes-cliente/${r.usuario?.id}`);
                  }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Ver Detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaReservasBusca;
