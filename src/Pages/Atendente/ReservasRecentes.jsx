import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabelaReservasBusca from '../../components/TabelaReservasBusca';
import FiltroStatusReserva from '../../components/FiltroStatusReserva';
import reservaService from '../../services/reservaService';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ReservasRecentes = () => {
  const [filtro, setFiltro] = useState('');
  const [status, setStatus] = useState('');
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarReservas = async () => {
      try {
        const dados = await reservaService.getTodasReservas();
        setReservas(Array.isArray(dados) ? dados : []);
      } catch (error) {
        console.error('Erro ao carregar reservas:', error);
        setReservas([]);
      } finally {
        setLoading(false);
      }
    };
    carregarReservas();
  }, []);

  const handleVerDetalhes = (reserva) => {
    navigate(`/dashboard-atendente/detalhes-reserva/${reserva.id}`);
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    const destino = reserva.pacoteViagem?.destino || '';
    const buscaTexto = destino.toLowerCase().includes(filtro.toLowerCase());
    const statusValido = status ? reserva.status?.toLowerCase() === status.toLowerCase() : true;
    return buscaTexto && statusValido;
  });

  return (
    // ✅ Layout geral da página com fundo cinza claro
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho da página */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[rgb(0,84,161)]">Reservas Recentes</h2>
          <p className="text-gray-500 mt-1">Filtre e gerencie as reservas dos clientes.</p>
        </div>

        {/* Container de Filtros e Resultados */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {/* Barra de Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Buscar por destino..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>
            <FiltroStatusReserva status={status} setStatus={setStatus} />
          </div>

          {/* Tabela de resultados */}
          {loading ? (
            <div className="text-center text-gray-500 py-10">Carregando reservas...</div>
          ) : (
            <TabelaReservasBusca reservas={reservasFiltradas} onVerDetalhes={handleVerDetalhes} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservasRecentes;
