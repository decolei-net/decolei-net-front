import React, { useState, useEffect } from 'react';
import TabelaReservasBusca from '../../components/TabelaReservasBusca';
import FiltroStatusReserva from '../../components/FiltroStatusReserva';
import reservaService from '../../services/reservaService';

const ReservasRecentes = () => {
  const [filtro, setFiltro] = useState('');
  const [status, setStatus] = useState('');
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const carregarReservas = async () => {
      try {
        const dados = await reservaService.getTodasReservas();
        setReservas(dados);
      } catch (error) {
        console.error('Erro ao carregar reservas:', error);
      }
    };
    carregarReservas();
  }, []);

  const reservasFiltradas = reservas.filter((reserva) => {
    const buscaTexto = reserva.pacoteViagem?.destino.toLowerCase().includes(filtro.toLowerCase());
    const statusValido = status ? reserva.status.toLowerCase() === status.toLowerCase() : true;
    return buscaTexto && statusValido;
  });

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-[rgb(0,84,161)]">Reservas Recentes</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por destino..."
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
