import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClienteResumoCard = ({ cliente }) => {
  if (!cliente) return null;

  return (
    <div className="border border-gray-300 rounded p-4 mb-4 bg-gray-50 shadow">
      <h4 className="text-lg font-bold text-gray-800 mb-2">{cliente.nomeCompleto}</h4>
      <p className="text-sm text-gray-600">📧 Email: {cliente.email}</p>
      <p className="text-sm text-gray-600">📞 Telefone: {cliente.telefone}</p>
      <p className="text-sm text-gray-600">🆔 Documento: {cliente.documento}</p>
      <p className="text-sm text-gray-600">👤 Perfil: {cliente.perfil}</p>
    </div>
  );
};

export default ClienteResumoCard;
