import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import usuarioService from '../../services/usuarioService';

const GerenciarUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [termoDeBusca, setTermoDeBusca] = useState({ nome: '', email: '', documento: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Pegando o ID do usuário logado do Redux, essencial para a regra de deleção
    const usuarioLogadoId = useSelector((state) => state.auth.user?.id);

    // Função assíncrona para buscar os usuários da API com filtros
    const buscarUsuarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const filtros = {
                nome: termoDeBusca.nome,
                email: termoDeBusca.email,
                documento: termoDeBusca.documento
            };
            const data = await usuarioService.getUsuarios(filtros);
            setUsuarios(data);
        } catch (err) {
            console.error("Erro ao buscar usuários:", err);
            setError(err.message || 'Erro ao carregar a lista de usuários.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarUsuarios();
    }, []);

    // Handler para atualizar o estado dos campos da barra de busca
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setTermoDeBusca(prevState => ({ ...prevState, [name]: value }));
    };

    // Handler para o evento de submissão do formulário de busca
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        buscarUsuarios();
    };

    const handleEditClick = (userId) => {
        navigate(`/dashboard-admin/usuarios/editar/${userId}`);
    };

    // Função para deletar um usuário, seguindo a lógica do GerenciarPacotes
    const handleDelete = async (usuario) => {
        // Regra de negócio: impede que o usuário logado se delete
        // Usamos o ID do Redux para a verificação
        if (usuario.id === usuarioLogadoId) {
            alert('Você não pode excluir seu próprio usuário.');
            return;
        }

        // TODO: (Futuro) Adicionar lógica de verificação se o usuário tem reservas ativas.
        // Por enquanto, a deleção é permitida, a menos que o backend retorne um erro.

        if (window.confirm(`Tem certeza que deseja excluir o usuário "${usuario.nomeCompleto}"? Esta ação é irreversível.`)) {
            try {
                await usuarioService.deletarUsuario(usuario.id);

                alert('Usuário excluído com sucesso!');
                // Remove o usuário da lista local para atualizar a UI
                setUsuarios(usuarios.filter(u => u.id !== usuario.id));
            } catch (err) {
                console.error("Falha ao excluir o usuário:", err);
                alert('Falha ao excluir o usuário.');
            }
        }
    };

    if (loading) return <p className="text-center p-4 text-gray-500">Carregando usuários...</p>;
    if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

    return (
        <div className="p-2 sm:p-4 bg-gray-100 min-h-screen">
            <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-6 p-4 bg-white rounded-lg shadow">
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
                                // Regra de negócio: um admin não pode deletar a si mesmo.
                                const isSelf = usuario.id === usuarioLogadoId;
                                const canDelete = !isSelf;

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
                                                onClick={() => handleEditClick(usuario.id)}
                                                className="p-1 text-indigo-600 hover:text-indigo-900"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(usuario)}
                                                className={`p-1 ${canDelete ? 'text-red-600 hover:text-red-900' : 'text-gray-400 cursor-not-allowed'}`}
                                                disabled={!canDelete}
                                                title={!canDelete ? "Você não pode deletar seu próprio usuário." : "Excluir usuário"}
                                            >
                                                <Trash2 size={18} />
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