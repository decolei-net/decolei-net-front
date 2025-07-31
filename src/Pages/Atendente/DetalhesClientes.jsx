import React from 'react';
import { useParams } from 'react-router-dom';
import TabelaHistoricoReservas from '../../components/TabelaHistoricoReservas';

const todosClientes = [
  {
    id: 1,
    nome: 'Carla Mendes',
    email: 'carla@email.com',
    cpf: '111.111.111-11',
    reservas: [
      {
        pacote: 'Pacote Férias em Cancún',
        dataInicio: '01/12/24',
        dataFim: '07/12/24',
        statusReserva: 'Confirmada',
        statusPagamento: 'Aprovado',
      },
    ],
  },
  {
    id: 2,
    nome: 'Rafael Souza',
    email: 'rafael@email.com',
    cpf: '222.222.222-22',
    reservas: [
      {
        pacote: 'Pacote Aventura Amazônia',
        dataInicio: '10/11/24',
        dataFim: '15/11/24',
        statusReserva: 'Pendente',
        statusPagamento: 'Pendente',
      },
    ],
  },
  {
    id: 3,
    nome: 'Joana S.',
    email: 'joana@email.com',
    cpf: '333.333.333-33',
    reservas: [
      {
        pacote: 'Viagem para Paris, França',
        dataInicio: '10/12/24',
        dataFim: '15/12/24',
        statusReserva: 'Confirmada',
        statusPagamento: 'Aprovado',
      },
    ],
  },
  {
    id: 4,
    nome: 'Marcos Paulo',
    email: 'marcos@email.com',
    cpf: '444.444.444-44',
    reservas: [
      {
        pacote: 'Roteiro Sul do Brasil',
        dataInicio: '05/01/25',
        dataFim: '12/01/25',
        statusReserva: 'Confirmada',
        statusPagamento: 'Aprovado',
      },
    ],
  },
];

const DetalhesCliente = () => {
  const { id } = useParams();
  const cliente = todosClientes.find((c) => c.id === parseInt(id));

  if (!cliente) {
    return <p className="text-red-500 p-4">Cliente não encontrado.</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-[rgb(0,84,161)]">👤 Detalhes do Cliente</h2>
      <div className="bg-gray-100 p-4 rounded mb-6">
        <p><strong>Nome:</strong> {cliente.nome}</p>
        <p><strong>E-mail:</strong> {cliente.email}</p>
        <p><strong>CPF:</strong> {cliente.cpf}</p>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-[rgb(0,84,161)]">📑 Histórico de Reservas</h3>
      <TabelaHistoricoReservas reservas={cliente.reservas} />
    </div>
  );
};

export default DetalhesCliente;
