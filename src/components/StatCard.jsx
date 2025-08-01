import React from 'react';

// Aceita um título, um valor e um ícone opcional
export default function StatCard({ title, value, icon }) {
  return (
    <div className="flex-1 rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center">
        {icon && <div className="mr-4">{icon}</div>}
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}