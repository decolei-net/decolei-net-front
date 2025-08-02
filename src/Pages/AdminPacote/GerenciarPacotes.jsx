import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import pacoteService from '../../services/pacoteServices';

export default function GerenciarPacotes() {
    const [pacotes, setPacotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPacotes = async () => {
            try {
                setLoading(true);
                const data = await pacoteService.getPacotes();
                setPacotes(data);
            } catch (err) {
                setError('Não foi possível carregar os pacotes.');
            } finally {
                setLoading(false);
            }
        };
        fetchPacotes();
    }, []);

    // Função para verificar se o pacote pode ser excluído
    const isDeletable = (pacote) => {
        const hoje = new Date();
        const dataFim = new Date(pacote.dataFim);
        // Remove a parte de hora/minuto para a comparação ser justa
        hoje.setHours(0, 0, 0, 0); 
        
        const semReservas = pacote.vagasDisponiveis === pacote.quantidadeVagas;
        const pacoteVencido = dataFim < hoje;
        
        return semReservas || pacoteVencido;
    };

    // Função para deletar um pacote
    const handleDelete = async (pacote) => {
        // A verificação agora é feita antes do popup de confirmação
        if (!isDeletable(pacote)) {
            alert('Este pacote não pode ser excluído pois ainda possui reservas ativas e não expirou.');
            return;
        }

        if (window.confirm(`Tem certeza que deseja excluir o pacote "${pacote.titulo}"? Esta ação não pode ser desfeita.`)) {
            try {
                await pacoteService.excluirPacote(pacote.id);
                alert('Pacote excluído com sucesso!');
                setPacotes(pacotes.filter(p => p.id !== pacote.id));
            } catch (err) {
                alert('Falha ao excluir o pacote.');
            }
        }
    };

    if (loading) return <p className="text-center p-4">Carregando pacotes...</p>;
    if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

    return (
        <div className="p-2 sm:p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciar Pacotes</h1>
                <button 
                    onClick={() => navigate('/dashboard-admin/pacotes/novo')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                    <PlusCircle size={20} />
                    Adicionar Novo Pacote
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vagas</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pacotes.map((pacote) => {
                            const deletable = isDeletable(pacote);
                            return (
                                <tr key={pacote.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pacote.titulo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pacote.destino}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {pacote.valor.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pacote.vagasDisponiveis} / {pacote.quantidadeVagas}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => navigate(`/dashboard-admin/pacotes/editar/${pacote.id}`)} className="text-indigo-600 hover:text-indigo-900 p-1">
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(pacote)} 
                                            // Estilo condicional para o botão
                                            className={`p-1 ${deletable ? 'text-red-600 hover:text-red-900' : 'text-gray-400 cursor-not-allowed'}`}
                                            disabled={!deletable}
                                            title={!deletable ? "Pacote com reservas ativas" : "Excluir pacote"}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                 {pacotes.length === 0 && <p className="text-center py-4 text-gray-500">Nenhum pacote cadastrado.</p>}
            </div>
        </div>
    );
}