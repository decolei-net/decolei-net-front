import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClienteResumoCard = ({ cliente }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/dashboard-atendente/detalhes-cliente/${cliente.id}`)}
      className="border p-4 mb-2 rounded shadow hover:bg-gray-100 cursor-pointer flex justify-between"
    >
      <span>{cliente.nome}</span>
      <span>{cliente.pacote}</span>
      <span className="text-green-600 font-semibold">{cliente.status}</span>
    </div>
  );
};

export default ClienteResumoCard;
