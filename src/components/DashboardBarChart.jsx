import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Componente para criar um Tooltip (caixinha que aparece ao passar o mouse) mais bonito
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded shadow-lg">
        <p className="font-bold text-gray-800">{label}</p>
        {/* Usamos "toLocaleString" para formatar números grandes, ex: 1000 -> 1.000 */}
        <p className="text-sm text-blue-600">{`Total: ${payload[0].value.toLocaleString('pt-BR')}`}</p>
      </div>
    );
  }
  return null;
};


export default function DashboardBarChart({ title, data }) {
    // Verifica se há dados para exibir o gráfico
    const hasData = data && data.length > 0;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-96 flex flex-col">
            <h3 className="font-bold text-lg text-gray-700 mb-4">{title}</h3>
            {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 20,
                            left: -10, // Ajuste para o YAxis ficar mais próximo
                           // Espaço para os labels inclinados
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="name" 
                          
                            interval={0}     // Garante que todos os nomes apareçam
                            tick={{ fontSize: 11 }} // Diminui um pouco a fonte
                            height={60}      // Aumenta a altura da área do eixo X
                        />
                        <YAxis 
                            allowDecimals={false} // Força o eixo Y a ter apenas valores discretos (inteiros)
                            tickFormatter={(value) => value.toLocaleString('pt-BR')} // Formata os números do eixo Y
                        />
                        <Tooltip 
                            content={<CustomTooltip />} 
                            cursor={{ fill: 'rgba(230, 230, 250, 0.6)' }} 
                        />
                        <Bar dataKey="value" fill="#3b82f6" name="Total" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-gray-500">Não há dados para exibir neste gráfico.</p>
                </div>
            )}
        </div>
    );
}