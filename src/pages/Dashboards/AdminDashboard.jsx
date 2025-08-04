import React, { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard';
import DashboardBarChart from '../../components/DashboardBarChart';
// Usando os serviços corretos que já existem no seu projeto
import reservaService from '../../services/reservaService';
import usuarioService from '../../services/usuarioService';

export default function AdminDashboard() {
  // Estados para guardar os dados, carregamento e erros
  const [stats, setStats] = useState({ vendas: 'R$ 0,00', reservas: 0, clientes: 0 });
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataAndProcess = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. BUSCAR DADOS BRUTOS DA API USANDO OS SERVIÇOS CERTOS
        // Chama GET /api/Reserva e GET /api/Usuario
        const [reservas, usuarios] = await Promise.all([
          reservaService.getTodasReservas(),
          usuarioService.getUsuarios(),
        ]);

        // 2. PROCESSAR E CALCULAR AS ESTATÍSTICAS
        const umMesAtras = new Date();
        umMesAtras.setMonth(umMesAtras.getMonth() - 1);

        // ==> Reservas Pendentes
        // Seu enum no backend usa 'PENDENTE', 'CONFIRMADA', etc.
        const reservasPendentes = reservas.filter(r => r.status?.toUpperCase() === 'PENDENTE').length;

        // ==> Total de Clientes
        // Seu banco não tem data de criação de usuário, então vamos contar o total de clientes.
        const totalClientes = usuarios.filter(u => u.perfil?.toUpperCase() === 'CLIENTE').length;

        // ==> Vendas do Mês
        const vendasMes = reservas
          .filter(r => r.status?.toUpperCase() === 'CONFIRMADA' && new Date(r.data) > umMesAtras)
          .reduce((total, r) => total + (r.valorTotal || 0), 0);

        // ==> Vendas por Destino (gráfico)
        const vendasPorDestino = reservas
          .filter(r => r.status?.toUpperCase() === 'CONFIRMADA')
          .reduce((acc, reserva) => {
            const destino = reserva.pacoteViagem?.destino || 'Desconhecido';
            const valor = reserva.valorTotal || 0;
            if (!acc[destino]) {
              acc[destino] = 0;
            }
            acc[destino] += valor;
            return acc;
          }, {});

        const formattedSalesData = Object.keys(vendasPorDestino).map(destino => ({
          name: destino,
          value: vendasPorDestino[destino]
        }));

        // 3. ATUALIZAR O ESTADO PARA EXIBIR NA TELA
        setStats({
          reservas: reservasPendentes,
          clientes: totalClientes,
          vendas: `R$ ${vendasMes.toFixed(2).replace('.', ',')}`
        });
        setSalesData(formattedSalesData);

      } catch (err) {
        console.error("Erro detalhado:", err);
        setError("Não foi possível carregar os dados. Verifique se a API está rodando e se você está logado como Admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndProcess();
  }, []);

  if (loading) {
    return <div className="text-center p-10 font-semibold text-gray-600">Carregando dados do painel...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
        <strong className="font-bold">Erro ao carregar o painel: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-900">Painel de Controle</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Vendas (Último Mês)" value={stats.vendas} />
        <StatCard title="Reservas Pendentes" value={stats.reservas} />
        {/* Alterado para refletir o que podemos calcular */}
        <StatCard title="Total de Clientes" value={stats.clientes} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DashboardBarChart title="Vendas por Destino (Total)" data={salesData} />
      </div>
    </div>
  );
}