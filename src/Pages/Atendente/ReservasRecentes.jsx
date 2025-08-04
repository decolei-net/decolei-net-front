import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import TabelaReservasBusca from '../../components/TabelaReservasBusca';
import FiltroStatusReserva from '../../components/FiltroStatusReserva';
import reservaService from '../../services/reservaService';
import { MagnifyingGlassIcon, CloudArrowDownIcon } from '@heroicons/react/24/outline';

const ReservasRecentes = () => {
  const [filtro, setFiltro] = useState('');
  const [status, setStatus] = useState('');
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
    const isAdmin = location.pathname.startsWith('/dashboard-admin');
    const path = isAdmin
      ? `/dashboard-admin/reservas/detalhes/${reserva.id}`
      : `/dashboard-atendente/detalhes-reserva/${reserva.id}`;
    navigate(path);
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    const destino = reserva.pacoteViagem?.destino || '';
    const buscaTexto = destino.toLowerCase().includes(filtro.toLowerCase());
    const statusValido = status ? reserva.status?.toLowerCase() === status.toLowerCase() : true;
    return buscaTexto && statusValido;
  });

  const handleExportarReservas = async () => {
    try {
      const response = await reservaService.exportarReservasPdf();
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `relatorio_reservas_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar reservas:', error);
      alert('Falha ao exportar o relatório. Verifique o console.');
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-blue-900">Reservas Recentes</h2>
            <p className="text-gray-500 mt-1">Filtre e gerencie as reservas dos clientes.</p>
          </div>
          <button
            onClick={handleExportarReservas}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            <CloudArrowDownIcon className="h-5 w-5 mr-2" />
            Exportar PDF
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 mb-6 border-b pb-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Buscar por destino..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <FiltroStatusReserva status={status} setStatus={setStatus} />
          </div>

          {/* Resultados */}
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
