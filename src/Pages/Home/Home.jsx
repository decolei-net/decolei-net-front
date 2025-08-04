import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import pacoteService from '../../services/pacoteServices.js';
import avaliacaoService from '../../services/avaliacoesServices.js';
import Card from '../../components/Card';
import Pagination from '../../components/Pagination';

const PACOTES_POR_PAGINA = 12;
const PACOTES_VISTOS_KEY = 'pacotesVistosRecentemente';

export default function Home() {
    // --- ESTADOS DE DADOS E CARREGAMENTO ---
    const [todosOsPacotes, setTodosOsPacotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState('');

    // --- ESTADOS DOS FILTROS ---
    const [filtros, setFiltros] = useState({
        destino: '',
        precoMin: '',
        precoMax: '',
        dataInicio: '',
        dataFim: '',
    });
    const [filtrosAplicados, setFiltrosAplicados] = useState({});

    // Renomeamos o estado para maior clareza. Agora guarda pacotes inteiros.
    const [historicoVisualizacao, setHistoricoVisualizacao] = useState([]);

    // --- ESTADOS DA PAGINAÇÃO ---
    const [paginaAtual, setPaginaAtual] = useState(1);
    const totalPaginas = Math.ceil(todosOsPacotes.length / PACOTES_POR_PAGINA);

    // Lógica para buscar os dados da API
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

    // Lógica para carregar o histórico de PACOTES VISTOS do localStorage.
    useEffect(() => {
        const storedHistory = localStorage.getItem(PACOTES_VISTOS_KEY);
        if (storedHistory) {
            try {
                const historicoCompleto = JSON.parse(storedHistory);
                // Pega apenas os 3 primeiros itens do array antes de salvar no estado.
                const historicoLimitado = historicoCompleto.slice(0, 3);
                setHistoricoVisualizacao(historicoLimitado);
            } catch (e) {
                console.error("Erro ao analisar o histórico de visualização:", e);
                setHistoricoVisualizacao([]);
            }
        }
    }, []); // Executa apenas uma vez quando o componente é montado.

    const pacotesDaPaginaAtual = useMemo(() => {
        const primeiroIndice = (paginaAtual - 1) * PACOTES_POR_PAGINA;
        const ultimoIndice = primeiroIndice + PACOTES_POR_PAGINA;
        return todosOsPacotes.slice(primeiroIndice, ultimoIndice);
    }, [paginaAtual, todosOsPacotes]);

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
            <div className="container mx-auto px-4 py-6 text-center">
                <div className="bg-blue-800 p-10 rounded-3xl mb-8 shadow-xl">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
                        Para onde você deseja ir?
                    </h1>
                    <p className="text-base text-blue-200 mb-6 max-w-xl mx-auto">
                        Busque por pacotes, destinos e datas para encontrar a viagem perfeita para você.
                    </p>
                    <form onSubmit={handleApplyFilters} className="space-y-4 max-w-3xl mx-auto">
                        <div className="flex items-center bg-white p-2 rounded-xl shadow-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
                            <input name="destino" type="text" value={filtros.destino} onChange={handleInputChange} placeholder="Busque por destino, hotel ou cidade..." className="flex-grow w-full bg-transparent border-none text-gray-800 placeholder-gray-400 focus:outline-none text-base px-2"/>
                            <button type="submit" className="bg-blue-600 text-white rounded-lg p-2 shadow-md hover:bg-blue-700 transform hover:scale-105 transition-transform duration-300">
                                <Search size={20} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="flex flex-col">
                              <label htmlFor="PreçoMín." className="text-xs font-medium text-white mb-1 self-start">Preço Mín.</label>
                              <input id="PrecoMin" type="number" name="precoMin" value={filtros.precoMin} onChange={handleInputChange} placeholder="Preço Mín." className="p-2 border rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                            </div>
                            <div className="flex flex-col">
                              <label htmlFor="precoMax" className="text-xs font-medium text-white mb-1 self-start">Preco Max</label>
                              <input id="PrecoMax" type="number" name="precoMax" value={filtros.precoMax} onChange={handleInputChange} placeholder="Preço Máx." className="p-2 border rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
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

            {/* O container principal para as seções de conteúdo */}
            <div className="container max-w-6xl mx-auto px-4 py-6">
                {/* VISTOS RECENTEMENTE */}
                {/* Esta seção só aparece se houver histórico */}
                {historicoVisualizacao.length > 0 && (
                    <div className="mb-8"> {/* Div que dá um espaço abaixo da seção */}
                        <h2 className="text-2xl font-bold text-gray-800 max-w-6xl mx-auto mb-4">Vistos recentemente</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                            {historicoVisualizacao.map((pacote) => (
                                <Link key={`hist-${pacote.id}`} to={`/pacotes/${pacote.id}`} className="block h-full">
                                    <Card pacote={pacote} />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Esta é a seção principal que mostra os resultados da busca */}
                <div >
                    <h2 className="text-2xl font-bold text-gray-800 max-w-6xl mx-auto mb-4">Destinos em destaque</h2>

                    {/* Lógica condicional para exibir loading, erro, ou os resultados */}
                    {isLoading ? (
                        <div className="text-center p-8 text-gray-500 font-bold text-sm">Buscando os melhores destinos para você...</div>
                    ) : erro ? (
                        <p className="text-center text-red-500 py-8 text-sm">{erro}</p>
                    ) : pacotesDaPaginaAtual.length > 0 ? (
                        <>
                            {/* A grade de cards com os pacotes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                                {pacotesDaPaginaAtual.map((pacote) => (
                                    <Link key={pacote.id} to={`/pacotes/${pacote.id}`} className="block h-full">
                                        <Card pacote={pacote} />
                                    </Link>
                                ))}
                            </div>

                            {/* A paginação, que só aparece se houver pacotes */}
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
                </div>
            </div>
        </div>
    );
}
