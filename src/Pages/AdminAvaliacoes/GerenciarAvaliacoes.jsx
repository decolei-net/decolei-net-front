import React, { useState, useEffect } from 'react';
import avaliacaoService from '../../services/avaliacoesServices'; 

export default function GerenciarAvaliacoes() {
    const [avaliacoesPendentes, setAvaliacoesPendentes] = useState([]);
    const [avaliacoesAprovadas, setAvaliacoesAprovadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Esta função será chamada ao carregar a página e após cada ação de moderação
    const fetchAvaliacoes = async () => {
        try {
            setLoading(true);
            
            // Busca as avaliações pendentes e as aprovadas do backend
            const pendentes = await avaliacaoService.getAvaliacoesPendentes();
            const aprovadas = await avaliacaoService.getAvaliacoesAprovadas();

            // Atualiza os estados com os dados recebidos
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

    // 3. Efeito para carregar os dados quando o componente é montado
    useEffect(() => {
        fetchAvaliacoes();
    }, []);

    // 4. Funções para lidar com as ações de moderação
    const handleAprovar = async (idAvaliacao) => {
        if (window.confirm("Tem certeza que deseja aprovar esta avaliação?")) {
            try {
                await avaliacaoService.moderarAvaliacao(idAvaliacao, 'aprovar');
                // Após a aprovação, recarrega a lista para mover a avaliação para a seção de aprovadas
                fetchAvaliacoes();
                alert('Avaliação aprovada com sucesso!');
            } catch (error) {
                alert('Erro ao aprovar avaliação.');
            }
        }
    };

    const handleReprovar = async (idAvaliacao) => {
        if (window.confirm("Tem certeza que deseja rejeitar esta avaliação? Ela será excluída.")) {
            try {
                // A função moderarAvaliacao com a ação 'rejeitar' já exclui a avaliação
                await avaliacaoService.moderarAvaliacao(idAvaliacao, 'rejeitar');
                // Recarrega a lista para remover a avaliação da tela
                fetchAvaliacoes();
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
                // Recarrega a lista para remover a avaliação da tela
                fetchAvaliacoes();
                alert('Avaliação excluída com sucesso!');
            } catch (error) {
                alert('Erro ao excluir avaliação.');
            }
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
            <h1 className="text-3xl font-bold text-blue-900">Gerenciar Avaliações</h1>

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

            <h1 className="text-3xl font-bold text-gray-800 mb-6">Moderar Avaliações</h1>

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