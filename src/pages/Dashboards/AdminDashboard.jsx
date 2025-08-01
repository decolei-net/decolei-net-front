import React from 'react';
import StatCard from '../../components/StatCard';
import DashboardBarChart from '../../components/DashboardBarChart';

// Dados estáticos para os gráficos (substituir por dados da API no futuro)
const vendasPorDestinoData = [
  { name: 'Paris', value: 4300 },
  { name: 'RJ', value: 3500 },
  { name: 'Recife', value: 2500 },
  { name: 'Espanha', value: 4100 },
];

const outroGraficoData = [
    { name: 'Paris', value: 4200 },
    { name: 'RJ', value: 3600 },
    { name: 'Recife', value: 2400 },
    { name: 'Espanha', value: 4000 },
];


export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Painel de Controle</h1>

      {/* Seção dos Cards de Resumo */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Vendas (Mês)"
          value="R$ 45.890,00"
        />
        <StatCard
          title="Reservas Pendentes"
          value="12"
        />
        <StatCard
          title="Novos Clientes (Mês)"
          value="32"
        />
      </div>

      {/* Seção dos Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardBarChart
          title="Vendas por Destino"
          data={vendasPorDestinoData}
        />
        <DashboardBarChart
          title="Algum outro gráfico"
          data={outroGraficoData}
        />
      </div>
    </div>
  );
}