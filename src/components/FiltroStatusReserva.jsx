import React from 'react';

const FiltroStatusReserva = ({ status, setStatus }) => {
  return (
    <div className="relative inline-block w-full md:w-64">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="block appearance-none w-full bg-white border border-gray-300 text-gray-800 text-md rounded-lg px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(0,84,161)] transition-colors"
      >
        <option value="">Todos os Status</option>
        <option value="Confirmada">Confirmada</option>
        <option value="Pendente">Pendente</option>
        <option value="Cancelada">Cancelada</option>
      </select>
      {/* Seta estilizada */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
        ▼
      </div>
    </div>
  );
};

export default FiltroStatusReserva;
