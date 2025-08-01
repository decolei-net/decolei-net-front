import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Aceita um título e os dados para o gráfico
export default function DashboardBarChart({ title, data }) {
  return (
    <div className="flex-1 rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">{title}</h3>
      {/* O ResponsiveContainer garante que o gráfico se ajuste ao tamanho do card */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10, // Ajusta o eixo Y para ficar mais próximo
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
          <YAxis tick={{ fill: '#6b7280' }} />
          <Tooltip
            cursor={{ fill: '#f3f4f6' }}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
          />
          {/* A cor da barra é definida aqui */}
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}