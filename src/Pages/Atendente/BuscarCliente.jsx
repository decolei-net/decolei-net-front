import React, { useState, useEffect } from 'react';
import ClienteResumoCard from '../../components/ClienteResumoCard';
import usuarioService from '../../services/usuarioService';

const BuscarCliente = () => {
  const [busca, setBusca] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [buscou, setBuscou] = useState(false);

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const dados = await usuarioService.getUsuarios();
        console.log('Clientes recebidos:', dados); // <-- Aqui é onde o log foi inserido
        setClientes(dados);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      }
    };
    carregarClientes();
  }, []);

  const handleBuscar = () => {
    const termo = busca.toLowerCase().trim();
    const resultado = clientes.filter(
      (cliente) =>
        cliente.nomeCompleto?.toLowerCase().includes(termo) ||
        cliente.email?.toLowerCase().includes(termo)
    );
    setClientesFiltrados(resultado);
    setBuscou(true);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-[rgb(0,84,161)]">🔍 Buscar Clientes</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Digite o nome ou e-mail do cliente..."
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
          <p className="text-gray-500">Nenhum cliente encontrado com esse nome ou e-mail.</p>
        ) : null}
      </div>
    </div>
  );
};

export default BuscarCliente;
