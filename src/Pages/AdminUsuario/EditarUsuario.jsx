import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usuarioService from '../../services/usuarioService';

const perfisDisponiveis = ['ADMIN', 'ATENDENTE', 'CLIENTE'];

export default function EditarUsuario() {
  // useParams() para obter o ID do usuário da URL (ex: /editar/1)
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados do componente
  const [usuario, setUsuario] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    documento: '',
    perfil: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect para buscar os dados do usuário quando o componente monta
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const dados = await usuarioService.getUsuarioPorId(id);
        setUsuario({
          nomeCompleto: dados.nomeCompleto,
          email: dados.email,
          telefone: dados.telefone,
          documento: dados.documento,
          perfil: dados.perfil
        });
      } catch (err) {
        setError('Não foi possível carregar os dados do usuário.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id]); // O efeito é executado novamente se o 'id' mudar

  // Handler para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prevState => ({ ...prevState, [name]: value }));
  };

  // Handler para o envio do formulário de atualização
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      // Cria o DTO de atualização com os dados do estado
      const updateDto = {
        nomeCompleto: usuario.nomeCompleto,
        telefone: usuario.telefone,
        documento: usuario.documento,
        perfil: usuario.perfil,
      };

      // Chama o serviço para atualizar o usuário
      await usuarioService.atualizarUsuarioPorAdmin(id, updateDto);
      alert('Usuário atualizado com sucesso!');
      navigate('/dashboard-admin/usuarios'); // Redireciona de volta para a lista
    } catch (err) {
      console.error("Falha ao atualizar o usuário:", err);
      setError('Falha ao atualizar o usuário. Verifique se os dados são válidos.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return <p className="text-center p-4 text-gray-500">Carregando dados do usuário...</p>;
  }

  if (error) {
    return <p className="text-center p-4 text-red-500 font-semibold">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Usuário</h1>
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              type="text"
              name="nomeCompleto"
              value={usuario.nomeCompleto}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={usuario.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-200"
              disabled // Email não é editável por padrão pelo administrador
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={usuario.telefone}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Documento</label>
            <input
              type="text"
              name="documento"
              value={usuario.documento}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Perfil</label>
            <select
              name="perfil"
              value={usuario.perfil}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Selecione um perfil</option>
              {perfisDisponiveis.map(perfil => (
                <option key={perfil} value={perfil}>{perfil}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard-admin/usuarios')}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
          {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}