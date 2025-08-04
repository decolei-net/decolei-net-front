import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import pacoteService from '../../services/pacoteServices.js';
import avaliacaoService from '../../services/avaliacoesServices.js';
import Card from '../../components/Card';
import Pagination from '../../components/Pagination';

const PACOTES_POR_PAGINA = 12;
const PACOTES_VISTOS_KEY = 'pacotesVistosRecentemente';

const VisuallyHidden = ({ children }) => (
  <span className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0" style={{ clip: 'rect(0, 0, 0, 0)' }}>
    {children}
  </span>
);

export default function Home() {
    const [todosOsPacotes, setTodosOsPacotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [filtros, setFiltros] = useState({
        destino: '',
        precoMin: '',
        precoMax: '',
        dataInicio: '',
        dataFim: '',
    });
    const [filtrosAplicados, setFiltrosAplicados] = useState({});
    const [historicoVisualizacao, setHistoricoVisualizacao] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const totalPaginas = Math.ceil(todosOsPacotes.length / PACOTES_POR_PAGINA);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const fetchDados = async () => {
            setIsLoading(true);
            setErro('');
            try {
                const filtrosValidos = Object.entries(filtrosAplicados).reduce((acc, [key, value]) => {
                    if (value) acc[key] = value;
                    return acc;
                }, {});
                const pacotesDaApi = await pacoteService.getPacotes(filtrosValidos);
                const pacotesCompletos = await Promise.all(
                    pacotesDaApi.map(async (pacote) => {
                        let avaliacoes = [];
                        try {
                           avaliacoes = await avaliacaoService.getAvaliacoesPorPacote(pacote.id);
                        } catch (err) {
                           console.warn(`Pacote ID ${pacote.id} não possui avaliações.`);
                        }
                        const totalAvaliacoes = avaliacoes.length;
                        let mediaAvaliacoes = 0;
                        if (totalAvaliacoes > 0) {
                            const somaDasNotas = avaliacoes.reduce((soma, aval) => soma + aval.nota, 0);
                            mediaAvaliacoes = parseFloat((somaDasNotas / totalAvaliacoes).toFixed(1));
                        }
                        return { ...pacote, mediaAvaliacoes, totalAvaliacoes };
                    })
                );
                setTodosOsPacotes(pacotesCompletos);
                setPaginaAtual(1);
            } catch (error) {
                console.error("Erro ao carregar pacotes:", error);
                setErro("Não foi possível carregar os pacotes. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDados();
    }, [filtrosAplicados]);

    useEffect(() => {
        const storedHistory = localStorage.getItem(PACOTES_VISTOS_KEY);
        if (storedHistory) {
            try {
                const historicoCompleto = JSON.parse(storedHistory);
                const historicoLimitado = historicoCompleto.slice(0, 3);
                setHistoricoVisualizacao(historicoLimitado);
            } catch (e) {
                console.error("Erro ao analisar o histórico de visualização:", e);
                setHistoricoVisualizacao([]);
            }
        }
      }, []);

      const pacotesDaPaginaAtual = useMemo(() => {
          const primeiroIndice = (paginaAtual - 1) * PACOTES_POR_PAGINA;
          const ultimoIndice = primeiroIndice + PACOTES_POR_PAGINA;
          return todosOsPacotes.slice(primeiroIndice, ultimoIndice);
      }, [paginaAtual, todosOsPacotes]);

    useEffect(() => {
        if (isLoading) {
            setStatusMessage('Buscando destinos...');
        } else if (erro) {
            setStatusMessage(`Erro: ${erro}`);
        } else if (pacotesDaPaginaAtual.length > 0) {
            setStatusMessage(`Busca concluída. ${todosOsPacotes.length} pacotes encontrados. Exibindo página ${paginaAtual} de ${totalPaginas}.`);
        } else {
            setStatusMessage('Nenhum pacote encontrado com os filtros selecionados.');
        }
    }, [isLoading, erro, pacotesDaPaginaAtual.length, paginaAtual, totalPaginas, todosOsPacotes.length]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if ((name === 'precoMin' || name === 'precoMax') && parseFloat(value) < 0) {
            return;
        }
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = (event) => {
        event.preventDefault();
        setFiltrosAplicados(filtros);
    };

    return (
        <div className="min-h-screen bg-blue-50 font-sans">
            <VisuallyHidden role="status" aria-live="polite">
                {statusMessage}
            </VisuallyHidden>

            <div className="container mx-auto px-4 py-6 text-center">
                <div className="bg-blue-800 p-10 rounded-3xl mb-8 shadow-xl">
                    <h1 id="main-heading" className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
                        Para onde você deseja ir?
                    </h1>
                    <p className="text-base text-blue-200 mb-6 max-w-xl mx-auto">
                        Busque por pacotes, destinos e datas para encontrar a viagem perfeita para você.
                    </p>
                    <form onSubmit={handleApplyFilters} className="space-y-4 max-w-3xl mx-auto" role="search" aria-labelledby="main-heading">
                        <div className="flex items-center bg-white p-2 rounded-xl shadow-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
                            <label htmlFor="destino-search" className="sr-only">Busque por destino, hotel ou cidade</label>
                            <input
                                id="destino-search"
                                name="destino"
                                type="text"
                                value={filtros.destino}
                                onChange={handleInputChange}
                                placeholder="Busque por destino, hotel ou cidade..."
                                className="flex-grow w-full bg-transparent border-none text-gray-800 placeholder-gray-400 focus:outline-none text-base px-2"
                            />
                            <button
                                type="submit"
                                aria-label="Buscar pacotes"
                                className="bg-blue-600 text-white rounded-lg p-2 shadow-md hover:bg-blue-700 transform hover:scale-105 transition-transform duration-300"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="flex flex-col">
                              <label htmlFor="precoMin" className="text-xs font-medium text-white mb-1 self-start">Preço Mín.</label>
                              <input id="precoMin" type="number" name="precoMin" value={filtros.precoMin} onChange={handleInputChange} placeholder="Preço Mín." className="p-2 border rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                            </div>
                            <div className="flex flex-col">
                              <label htmlFor="precoMax" className="text-xs font-medium text-white mb-1 self-start">Preço Máx.</label>
                              <input id="precoMax" type="number" name="precoMax" value={filtros.precoMax} onChange={handleInputChange} placeholder="Preço Máx." className="p-2 border rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="dataInicio" className="text-xs font-medium text-white mb-1 self-start">Data de Início</label>
                                <input id="dataInicio" type="date" name="dataInicio" value={filtros.dataInicio} onChange={handleInputChange} className="p-2 border rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="dataFim" className="text-xs font-medium text-white mb-1 self-start">Data de Fim</label>
                                <input id="dataFim" type="date" name="dataFim" value={filtros.dataFim} onChange={handleInputChange} className="p-2 border rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <main className="container max-w-6xl mx-auto px-4 py-6">
                {historicoVisualizacao.length > 0 && (
                    <section className="mb-8" aria-labelledby="vistos-recentemente-heading">
                        <h2 id="vistos-recentemente-heading" className="text-2xl font-bold text-gray-800 max-w-6xl mx-auto mb-4">Vistos recentemente</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                            {historicoVisualizacao.map((pacote) => (
                                <Link key={`hist-${pacote.id}`} to={`/pacotes/${pacote.id}`} className="block h-full" aria-label={`Ver detalhes do pacote para ${pacote.destino}`}>
                                    <Card pacote={pacote} />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <section aria-labelledby="destinos-heading">
                    <h2 id="destinos-heading" className="text-2xl font-bold text-gray-800 max-w-6xl mx-auto mb-4">Destinos em destaque</h2>
                    {isLoading ? (
                        <div className="text-center p-8 text-gray-500 font-bold text-sm">Buscando os melhores destinos para você...</div>
                    ) : erro ? (
                        <p className="text-center text-red-500 py-8 text-sm" role="alert">{erro}</p>
                    ) : pacotesDaPaginaAtual.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                                {pacotesDaPaginaAtual.map((pacote) => (
                                    <Link key={pacote.id} to={`/pacotes/${pacote.id}`} className="block h-full" aria-label={`Ver detalhes do pacote para ${pacote.destino}`}>
                                        <Card pacote={pacote} />
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-6 max-w-6xl mx-auto">
                                <Pagination
                                    paginaAtual={paginaAtual}
                                    totalPaginas={totalPaginas}
                                    onPageChange={setPaginaAtual}
                                />
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500 py-8 text-sm">Nenhum pacote encontrado com os filtros selecionados. Tente ajustar sua busca!</p>
                    )}
                </section>
            </main>
        </div>
    );
}
