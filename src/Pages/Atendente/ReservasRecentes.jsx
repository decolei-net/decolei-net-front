import React, { useState } from 'react';
import TabelaReservasBusca from '../../components/TabelaReservasBusca';
import FiltroStatusReserva from '../../components/FiltroStatusReserva';

const ReservasRecentes = () => {
  const [filtro, setFiltro] = useState('');
  const [status, setStatus] = useState('');

  const reservas = [
    { id: 1, nome: 'Carla Mendes', cpf: '111.111.111-11', pacote: 'Pacote Férias em Cancún', status: 'Confirmada' },
    { id: 2, nome: 'Rafael Souza', cpf: '222.222.222-22', pacote: 'Pacote Aventura Amazônia', status: 'Pendente' },
    { id: 3, nome: 'Joana Silva', cpf: '333.333.333-33', pacote: 'Viagem a Paris', status: 'Cancelada' },
    { id: 4, nome: 'Marcos Paulo', cpf: '444.444.444-44', pacote: 'Roteiro Sul do Brasil', status: 'Confirmada' },
  ];

  // Filtragem dinâmica baseada no input e status selecionado
  const reservasFiltradas = reservas.filter((reserva) => {
    const buscaTexto = reserva.pacote.toLowerCase().includes(filtro.toLowerCase());
    const statusValido = status ? reserva.status.toLowerCase() === status.toLowerCase() : true;
    return buscaTexto && statusValido;
  });

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6" style={{ color: 'rgb(0, 84, 161)' }}>
        📆 Buscar Reservas
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por pacote ou destino..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FiltroStatusReserva status={status} setStatus={setStatus} />
      </div>

      <TabelaReservasBusca reservas={reservasFiltradas} />
    </div>
  );
};

export default ReservasRecentes;
