import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X } from 'lucide-react';
import pacoteService from '../../services/pacoteServices';
import imagemService from '../../services/imagemService'; // Verifique se o nome do serviço é este

export default function AdminPacotes() {
    const navigate = useNavigate();

    // Estados para os campos do formulário
    const [titulo, setTitulo] = useState('');
    const [destino, setDestino] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [valor, setValor] = useState('');

    // Estado para as imagens e vídeos
    const [imagens, setImagens] = useState([]);
    const [videoUrl, setVideoUrl] = useState('');

    // Estados de controle
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Lida com a seleção de arquivos de imagem
    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setImagens(prev => [...prev, ...filesArray]);
        }
    };

    // Remove uma imagem da lista de preview
    const handleRemoveImage = (index) => {
        setImagens(prev => prev.filter((_, i) => i !== index));
    };

    const handleCancel = () => {
        navigate('/admin/dashboard');
    };

    // Lida com o envio do formulário completo
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const pacoteData = { titulo, destino, descricao, dataInicio, dataFim, valor: parseFloat(valor) };

        try {
            // 1. Cria o pacote primeiro para obter um ID
            const novoPacote = await pacoteService.criarPacote(pacoteData);

            if (novoPacote && novoPacote.id) {
                const pacoteId = novoPacote.id;

                // 2. Faz o upload das imagens associadas ao ID do pacote
                if (imagens.length > 0) {
                    await Promise.all(
                        imagens.map(img => imagemService.uploadImagem(pacoteId, img.file))
                    );
                }

                // 3. Adiciona a URL do vídeo, se houver
                if (videoUrl) {
                    await imagemService.addVideo(pacoteId, videoUrl);
                }

                alert('Pacote criado com sucesso!');
                navigate('/admin/dashboard'); // Volta para o painel após o sucesso
            } else {
                throw new Error('A API não retornou um ID para o novo pacote.');
            }

        } catch (err) {
            console.error("Erro ao criar pacote:", err);
            setError('Falha ao criar o pacote. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2 sm:p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Adicionar Novo Pacote</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Coluna da Esquerda: Imagens e Vídeos */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">Imagens e Vídeos</h2>
                        
                        {/* Área de Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50">
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">Arraste as imagens ou clique para enviar</p>
                                <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={handleImageChange} />
                            </label>
                        </div>

                        {/* Previews das Imagens */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {imagens.map((img, index) => (
                                <div key={index} className="relative group">
                                    <img src={img.preview} alt={`preview ${index}`} className="h-24 w-full object-cover rounded-md" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Campo para URL do Vídeo */}
                        <div>
                            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">URL do Vídeo (YouTube)</label>
                            <input
                                type="url"
                                id="videoUrl"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://www.youtube.com/embed/..."
                            />
                        </div>
                    </div>

                    {/* Coluna da Direita: Detalhes do Pacote */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">Detalhes do Pacote</h2>
                        
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título do Pacote</label>
                            <input type="text" id="titulo" value={titulo} onChange={e => setTitulo(e.target.value)} required className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                        
                        <div>
                            <label htmlFor="destino" className="block text-sm font-medium text-gray-700">Destino (Ex: Paris, França)</label>
                            <input type="text" id="destino" value={destino} onChange={e => setDestino(e.target.value)} required className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                        
                        <div>
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição Completa</label>
                            <textarea id="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} required rows="4" className="mt-1 w-full p-2 border rounded-md"></textarea>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700">Data de Início</label>
                                <input type="date" id="dataInicio" value={dataInicio} onChange={e => setDataInicio(e.target.value)} required className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700">Data de Fim</label>
                                <input type="date" id="dataFim" value={dataFim} onChange={e => setDataFim(e.target.value)} required className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="valor" className="block text-sm font-medium text-gray-700">Valor por pessoa (R$)</label>
                            <input type="number" id="valor" value={valor} onChange={e => setValor(e.target.value)} required min="0" step="0.01" className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                    </div>
                </div>

                {/* Mensagem de Erro */}
                {error && <p className="text-red-600 text-center mt-4">{error}</p>}

                {/* Botões de Ação */}
                <div className="mt-8 flex justify-end gap-4">
                    <button type="button" onClick={handleCancel} className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? 'Salvando...' : 'Salvar Pacote'}
                    </button>
                </div>
            </form>
        </div>
    );
}