import React, { useState, useEffect } from 'react';
import avaliacaoService from '../../services/avaliacoesServices';
import pacoteService from '../../services/pacoteServices';

export default function GerenciarAvaliacoes() {
    const [avaliacoesPendentes, setAvaliacoesPendentes] = useState([]);
    const [avaliacoesAprovadas, setAvaliacoesAprovadas] = useState([]);
    const [textoBusca, setTextoBusca] = useState(''); // Estado para o que o usuário digita
    const [filtroDestino, setFiltroDestino] = useState(''); // Estado que aciona a busca na API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função que agora aceita o texto do destino como filtro
    const fetchAvaliacoes = async (destino = '') => {
        try {
            setLoading(true);
            const pendentes = await avaliacaoService.getAvaliacoesPendentes(destino);
            const aprovadas = await avaliacaoService.getAvaliacoesAprovadas(destino);

            setAvaliacoesPendentes(pendentes);
            setAvaliacoesAprovadas(aprovadas);
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar avaliações:", err);
            setError("Não foi possível carregar as avaliações. Verifique a conexão com a API.");
        } finally {
            setLoading(false);
        }
    };
    
    // Este useEffect é o único responsável por fazer a busca.
    // Ele é chamado na montagem do componente (com filtro vazio) e sempre que filtroDestino muda.
    useEffect(() => {
        fetchAvaliacoes(filtroDestino);
    }, [filtroDestino]);

    const handleAprovar = async (idAvaliacao) => {
        if (window.confirm("Tem certeza que deseja aprovar esta avaliação?")) {
            try {
                await avaliacaoService.moderarAvaliacao(idAvaliacao, 'aprovar');
                fetchAvaliacoes(filtroDestino); // Recarrega com o filtro atual
                alert('Avaliação aprovada com sucesso!');
            } catch (error) {
                alert('Erro ao aprovar avaliação.');
            }
        }
    };

    const handleReprovar = async (idAvaliacao) => {
        if (window.confirm("Tem certeza que deseja rejeitar esta avaliação? Ela será excluída.")) {
            try {
                await avaliacaoService.moderarAvaliacao(idAvaliacao, 'rejeitar');
                fetchAvaliacoes(filtroDestino); // Recarrega com o filtro atual
                alert('Avaliação rejeitada e excluída com sucesso!');
            } catch (error) {
                alert('Erro ao rejeitar avaliação.');
            }
        }
    };

    const handleExcluir = async (idAvaliacao) => {
        if (window.confirm("Tem certeza que deseja EXCLUIR esta avaliação permanentemente?")) {
            try {
                await avaliacaoService.moderarAvaliacao(idAvaliacao, 'rejeitar');
                fetchAvaliacoes(filtroDestino); // Recarrega com o filtro atual
                alert('Avaliação excluída com sucesso!');
            } catch (error) {
                alert('Erro ao excluir avaliação.');
            }
        }
    };

    // Ação do botão: atualiza o estado que dispara o useEffect
    const handleFiltrar = () => {
        setFiltroDestino(textoBusca);
    };

    // Ação da tecla: se for Enter, dispara a busca
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleFiltrar();
        }
    };

    const renderStars = (nota) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={`fa fa-star ${i < nota ? 'text-yellow-400' : 'text-gray-300'}`}></span>
            );
        }
        return stars;
    };

    if (loading) return <div className="text-center mt-8">Carregando avaliações...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-4">Gerenciar Avaliações</h1>

            {/* Seção de Filtro com caixa de texto e botão */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4">Filtro de Avaliações</h2>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Pesquisar por destino..."
                        value={textoBusca}
                        onChange={(e) => setTextoBusca(e.target.value)}
                        onKeyDown={handleKeyDown} // Adiciona o handler para a tecla 'Enter'
                        className="border rounded-md p-2 w-full max-w-sm"
                    />
                    <button
                        onClick={handleFiltrar}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                    >
                        Filtrar
                    </button>
                </div>
            </div>

            {/* Seção de Avaliações Pendentes */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4">Avaliações Pendentes</h2>
                {avaliacoesPendentes.length > 0 ? (
                    avaliacoesPendentes.map(avaliacao => (
                        <div key={avaliacao.id} className="border-b border-gray-200 py-4 flex justify-between items-center last:border-b-0">
                            <div>
                                <p className="font-semibold">{avaliacao.usuario} avaliou <span className="text-blue-600">"{avaliacao.pacote}"</span></p>
                                <div className="my-2 flex items-center">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">Pendente</span>
                                    {renderStars(avaliacao.nota)}
                                </div>
                                <p className="text-gray-600 mt-2">{avaliacao.comentario}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleAprovar(avaliacao.id)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                                >
                                    Aprovar
                                </button>
                                <button
                                    onClick={() => handleReprovar(avaliacao.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                                >
                                    Reprovar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Nenhuma avaliação pendente no momento.</p>
                )}
            </div>

            {/* Seção de Avaliações Aprovadas (para exclusão) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Avaliações Aprovadas</h2>
                {avaliacoesAprovadas.length > 0 ? (
                    avaliacoesAprovadas.map(avaliacao => (
                        <div key={avaliacao.id} className="border-b border-gray-200 py-4 flex justify-between items-center last:border-b-0">
                            <div>
                                <p className="font-semibold">{avaliacao.usuario} avaliou <span className="text-blue-600">"{avaliacao.pacote}"</span></p>
                                <div className="my-2 flex items-center">
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">Aprovada</span>
                                    {renderStars(avaliacao.nota)}
                                </div>
                                <p className="text-gray-600 mt-2">{avaliacao.comentario}</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleExcluir(avaliacao.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Nenhuma avaliação aprovada encontrada.</p>
                )}
            </div>
        </div>
    );
}