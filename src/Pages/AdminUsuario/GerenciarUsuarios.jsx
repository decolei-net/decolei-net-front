import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react'; // Ícones para editar e deletar
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
    // O ID do usuário logado é necessário para a regra de negócio
    const usuarioLogadoId = "id-do-usuario-logado-aqui"; // Substitua pela lógica real de obter o ID do usuário logado
    const navigate = useNavigate();

    // Função para buscar os usuários (implementação simulada)
    const buscarUsuarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const dados = await usuarioService.getUsuarios(); // Chama o serviço para buscar os usuários
            const usuariosFiltrados = dados.filter(user => {
                const nomeMatch = user.nomeCompleto.toLowerCase().includes(termoDeBusca.nome.toLowerCase());
                const emailMatch = user.email.toLowerCase().includes(termoDeBusca.email.toLowerCase());
                const documentoMatch = user.documento ? user.documento.toLowerCase().includes(termoDeBusca.documento.toLowerCase()) : true;
                return nomeMatch && emailMatch && documentoMatch;
            });
            setUsuarios(usuariosFiltrados);
        } catch (err) {
            console.error("Erro ao buscar usuários:", err);
            setError("Não foi possível carregar os usuários.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarUsuarios();
    }, []); // Executa a busca inicial

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
    
    // ✅ Nova função para navegar para a tela de detalhes
    const handleDetalhesClick = (id) => {
        navigate(`/dashboard-admin/usuarios/detalhes/${id}`);
    };

    const handleDelete = async (usuario) => {
        if (window.confirm(`Tem certeza que deseja excluir o usuário ${usuario.nomeCompleto}?`)) {
            try {
                await usuarioService.deleteUsuario(usuario.id); // Chama o serviço para deletar
                setUsuarios(usuarios.filter(u => u.id !== usuario.id));
                alert("Usuário excluído com sucesso!");
            } catch (err) {
                console.error("Erro ao deletar usuário:", err);
                alert("Não foi possível excluir o usuário. Tente novamente.");
            }
        }
    };

    return (
        <div className="p-2 sm:p-4 bg-gray-100 min-h-screen">
            {/* Adiciona o título da página */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-blue-900">Gerenciar Usuários</h2>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="flex flex-wrap md:flex-nowrap gap-4 mb-6 p-4 bg-white rounded-lg shadow">
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
                                            {/* Botão de detalhes com texto e estilo corrigidos */}
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