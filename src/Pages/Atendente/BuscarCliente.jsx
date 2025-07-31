import React, { useState } from 'react';
import ClienteResumoCard from '../../components/ClienteResumoCard';

const BuscarCliente = () => {
  const [busca, setBusca] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [buscou, setBuscou] = useState(false); // <- controla se houve tentativa de busca

  const todosClientes = [
    { id: 1, nome: 'Carla Mendes', cpf: '111.111.111-11', pacote: 'Pacote Férias em Cancún', status: 'Confirmada' },
    { id: 2, nome: 'Rafael Souza', cpf: '222.222.222-22', pacote: 'Pacote Aventura Amazônia', status: 'Pendente' },
    { id: 3, nome: 'Joana Silva', cpf: '333.333.333-33', pacote: 'Viagem a Paris', status: 'Cancelada' },
    { id: 4, nome: 'Marcos Paulo', cpf: '444.444.444-44', pacote: 'Roteiro Sul do Brasil', status: 'Confirmada' },
  ];

  const handleBuscar = () => {
    const termo = busca.toLowerCase().trim();
    const resultado = todosClientes.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(termo) ||
        cliente.cpf.toLowerCase().includes(termo)
    );
    setClientesFiltrados(resultado);
    setBuscou(true); // <- marca que o usuário clicou em buscar
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-[rgb(0,84,161)]">🔍 Buscar Clientes</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Digite o nome ou CPF do cliente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleBuscar}
          className="bg-[rgb(0,84,161)] hover:bg-[rgb(0,50,100)] text-white px-6 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Resultados:</h3>
        {clientesFiltrados.length > 0 ? (
          clientesFiltrados.map((cliente) => (
            <ClienteResumoCard key={cliente.id} cliente={cliente} />
          ))
        ) : buscou ? (
          <p className="text-gray-500">Nenhum cliente encontrado com esse nome ou CPF.</p>
        ) : null}
      </div>
    </div>
  );
};

export default BuscarCliente;
