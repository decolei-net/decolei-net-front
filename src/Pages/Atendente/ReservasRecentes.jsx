import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabelaReservasBusca from '../../components/TabelaReservasBusca';
import FiltroStatusReserva from '../../components/FiltroStatusReserva';
import reservaService from '../../services/reservaService';

const ReservasRecentes = () => {
  const [filtro, setFiltro] = useState('');
  const [status, setStatus] = useState('');
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true); // Adicionado para feedback de carregamento
  const navigate = useNavigate();

  // ✅ Lógica para carregar as reservas (restaurada)
  useEffect(() => {
    const carregarReservas = async () => {
      try {
        const dados = await reservaService.getTodasReservas();
        setReservas(Array.isArray(dados) ? dados : []);
      } catch (error) {
        console.error('Erro ao carregar reservas:', error);
        setReservas([]); // Garante que é um array em caso de erro
      } finally {
        setLoading(false);
      }
    };
    carregarReservas();
  }, []);

  const handleVerDetalhes = (reserva) => {
    // Navega para a nova tela de gestão, usando a rota completa
    navigate(`/dashboard-atendente/detalhes-reserva/${reserva.id}`);
  };

  // ✅ Lógica de filtro (restaurada)
  const reservasFiltradas = reservas.filter((reserva) => {
    const destino = reserva.pacoteViagem?.destino || '';
    const buscaTexto = destino.toLowerCase().includes(filtro.toLowerCase());
    const statusValido = status ? reserva.status?.toLowerCase() === status.toLowerCase() : true;
    return buscaTexto && statusValido;
  });

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md">
      {/* ✅ JSX do título e filtros (restaurado) */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[rgb(0,84,161)]">
        Reservas Recentes
      </h2>

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

      {/* Tabela de resultados */}
      {loading ? (
        <p className="text-center text-gray-500">Carregando reservas...</p>
      ) : (
        <TabelaReservasBusca reservas={reservasFiltradas} onVerDetalhes={handleVerDetalhes} />
      )}
    </div>
  );
};

export default ReservasRecentes;
