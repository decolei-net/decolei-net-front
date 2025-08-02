import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import pacoteService from '../../services/pacoteServices';
import imagemService from '../../services/imagemService'; // Precisamos do serviço de imagem
import { Trash2, Camera, Video } from 'lucide-react'; // Ícones para a nova seção

export default function EditarPacote() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pacoteData, setPacoteData] = useState({
        titulo: '',
        destino: '',
        descricao: '',
        dataInicio: '',
        dataFim: '',
        valor: '',
        quantidadeVagas: '',
        imagens: [] // Inicializa a propriedade de imagens
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Função para buscar os dados do pacote, incluindo as mídias
    const fetchPacote = async () => {
        try {
            setLoading(true);
            const data = await pacoteService.getPacotePorId(id);
            setPacoteData({
                ...data,
                dataInicio: new Date(data.dataInicio).toISOString().split('T')[0],
                dataFim: new Date(data.dataFim).toISOString().split('T')[0],
                // Garante que o array de imagens exista
                imagens: data.imagens || []
            });
        } catch (err) {
            setError('Não foi possível carregar os dados do pacote.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPacote();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPacoteData(prev => ({ ...prev, [name]: value }));
    };

    // Função para deletar uma imagem ou vídeo
    const handleDeleteMedia = async (mediaId) => {
        if (window.confirm('Tem certeza que deseja excluir esta mídia? Esta ação é permanente.')) {
            try {
                // Chama o serviço para excluir a imagem/vídeo no backend
                await imagemService.excluirImagem(mediaId);
                // Atualiza o estado local para remover a mídia da UI instantaneamente
                setPacoteData(prev => ({
                    ...prev,
                    imagens: prev.imagens.filter(img => img.id !== mediaId)
                }));
                alert('Mídia excluída com sucesso!');
            } catch (err) {
                alert('Falha ao excluir a mídia.');
                console.error(err);
            }
        }
    };

    // Função para salvar as alterações de texto do pacote
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Não enviamos mais o array 'imagens' para a rota de atualização de pacote
            const { imagens, ...dataToUpdate } = {
                ...pacoteData,
                valor: parseFloat(pacoteData.valor),
                quantidadeVagas: parseInt(pacoteData.quantidadeVagas, 10)
            };
            await pacoteService.atualizarPacote(id, dataToUpdate);
            alert('Pacote atualizado com sucesso!');
            navigate('/dashboard-admin/pacotes');
        } catch (err) {
            setError('Falha ao atualizar o pacote. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center p-4">Carregando...</p>;

    return (
        <div className="p-2 sm:p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Pacote</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coluna 1 e 2: Detalhes do Pacote */}
                    <div className="lg:col-span-2 space-y-4">
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
                            <input type="text" id="titulo" name="titulo" value={pacoteData.titulo} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="destino" className="block text-sm font-medium text-gray-700">Destino</label>
                            <input type="text" id="destino" name="destino" value={pacoteData.destino} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <textarea id="descricao" name="descricao" value={pacoteData.descricao} onChange={handleChange} required rows="4" className="mt-1 w-full p-2 border border-gray-300 rounded-md"></textarea>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700">Data de Início</label>
                                <input type="date" id="dataInicio" name="dataInicio" value={pacoteData.dataInicio} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700">Data de Fim</label>
                                <input type="date" id="dataFim" name="dataFim" value={pacoteData.dataFim} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="valor" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                                <input type="number" id="valor" name="valor" value={pacoteData.valor} onChange={handleChange} required min="0" step="0.01" className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="quantidadeVagas" className="block text-sm font-medium text-gray-700">Vagas Totais</label>
                                <input type="number" id="quantidadeVagas" name="quantidadeVagas" value={pacoteData.quantidadeVagas} onChange={handleChange} required min="1" className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Coluna 3: Gerenciamento de Mídia */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Gerenciar Mídia</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {pacoteData.imagens && pacoteData.imagens.length > 0 ? (
                                pacoteData.imagens.map(media => (
                                    <div key={media.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {media.isVideo ? <Video size={20} className="text-blue-500 flex-shrink-0" /> : <Camera size={20} className="text-purple-500 flex-shrink-0" />}
                                            <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 truncate hover:underline" title={media.url}>
                                                {/* Mostra um trecho da URL para ficar mais limpo */}
                                                {media.url.substring(0, 35)}...
                                            </a>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => handleDeleteMedia(media.id)} 
                                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full flex-shrink-0"
                                            title="Excluir Mídia"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">Nenhuma imagem ou vídeo cadastrado.</p>
                            )}
                        </div>
                         {/* Futuramente você pode adicionar um upload de novas imagens aqui também */}
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                    <button type="button" onClick={() => navigate('/dashboard-admin/pacotes')} className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100">Cancelar</button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
}