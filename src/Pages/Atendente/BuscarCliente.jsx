import React, { useState, useEffect } from 'react';
import ClienteResumoCard from '../../components/ClienteResumoCard';
import usuarioService from '../../services/usuarioService.js';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const BuscarCliente = () => {
  const [busca, setBusca] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega todos os usuários e filtra apenas por clientes
  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const todosUsuarios = await usuarioService.getUsuarios();
        // Garante que o campo 'perfil' existe antes de filtrar
        const apenasClientes = todosUsuarios.filter((usuario) => usuario.perfil === 'CLIENTE');
        setClientes(apenasClientes);
        setClientesFiltrados(apenasClientes);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarUsuarios();
  }, []);

  // Filtra dinamicamente a lista de clientes
  useEffect(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) {
      setClientesFiltrados(clientes);
      return;
    }
    const resultado = clientes.filter(
      (cliente) =>
        cliente.nomeCompleto?.toLowerCase().includes(termo) ||
        cliente.email?.toLowerCase().includes(termo),
    );
    setClientesFiltrados(resultado);
  }, [busca, clientes]);

  return (
    // ✅ Layout geral da página com fundo cinza claro
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho da página */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[rgb(0,84,161)]">Clientes</h2>
          <p className="text-gray-500 mt-1">
            Busque ou navegue pela lista de clientes cadastrados.
          </p>
        </div>

        {/* Barra de Busca com ícone */}
        <div className="relative mb-8">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Digite o nome ou e-mail para filtrar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>

        {/* Container de Resultados */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {busca ? `Resultados da busca:` : 'Todos os Clientes:'}
          </h3>
          {loading ? (
            <div className="text-center text-gray-500 py-10">Carregando clientes...</div>
          ) : clientesFiltrados.length > 0 ? (
            <div className="space-y-4">
              {clientesFiltrados.map((cliente) => (
                <ClienteResumoCard key={cliente.id} cliente={cliente} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">Nenhum cliente encontrado.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuscarCliente;
