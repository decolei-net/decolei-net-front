import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react'; // Ícone para editar
import usuarioService from '../../services/usuarioService';

const GerenciarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [termoDeBusca, setTermoDeBusca] = useState({
    nome: '',
    email: '',
    documento: ''
  });

  const navigate = useNavigate();

  // Função para buscar os usuários (implementação real)
  const buscarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await usuarioService.getUsuarios(termoDeBusca); // Chama o serviço para buscar os usuários com filtros
      setUsuarios(dados);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError("Não foi possível carregar os usuários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, [termoDeBusca]); // Executa a busca inicial e sempre que o termo de busca mudar

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setTermoDeBusca(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    buscarUsuarios();
  };

  const handleEditClick = (id) => {
    navigate(`/dashboard-admin/usuarios/editar/${id}`);
  };

  const handleDetalhesClick = (id) => {
    navigate(`/dashboard-admin/usuarios/detalhes/${id}`);
  };

  return (
    <div className="p-2 sm:p-4 bg-gray-100 min-h-screen font-sans">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-blue-900">Gerenciar Usuários</h2>
      </div>

      {/* Formulário de Busca */}
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap md:flex-nowrap gap-4 mb-6 p-4 bg-white rounded-lg shadow-md">
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={termoDeBusca.nome}
          onChange={handleSearchChange}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={termoDeBusca.email}
          onChange={handleSearchChange}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="documento"
          placeholder="Documento"
          value={termoDeBusca.documento}
          onChange={handleSearchChange}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
          Buscar
        </button>
      </form>

      {loading && <p className="text-center text-gray-500">Carregando usuários...</p>}
      {error && <p className="text-center text-red-500 font-semibold">{error}</p>}

      {!loading && !error && (
        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOME</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PERFIL</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.map(usuario => {
                return (
                  <tr key={usuario.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usuario.nomeCompleto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${usuario.perfil === 'ADMIN' ? 'bg-red-100 text-red-800' :
                           usuario.perfil === 'ATENDENTE' ? 'bg-blue-100 text-blue-800' :
                           'bg-gray-100 text-gray-800'}`
                        }
                      >
                        {usuario.perfil}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleDetalhesClick(usuario.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Detalhes
                      </button>
                      <button
                        onClick={() => handleEditClick(usuario.id)}
                        className="p-1 text-indigo-600 hover:text-indigo-900"
                        title="Editar Usuário"
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {usuarios.length === 0 && <p className="text-center py-4 text-gray-500">Nenhum usuário encontrado.</p>}
        </div>
      )}
    </div>
  );
};

export default GerenciarUsuarios;
