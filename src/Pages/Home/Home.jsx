import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import pacoteService from '../../services/pacoteServices.js';
import avaliacaoService from '../../services/avaliacoesServices.js';
import Card from '../../components/Card';
import Pagination from '../../components/Pagination'; // ✅ Importe o componente de paginação

const PACOTES_POR_PAGINA = 24;

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

    // --- ESTADOS DA PAGINAÇÃO ---
    const [paginaAtual, setPaginaAtual] = useState(1);
    const totalPaginas = Math.ceil(todosOsPacotes.length / PACOTES_POR_PAGINA);

    // ✅ Lógica para buscar os dados da API quando os filtros são aplicados
    useEffect(() => {
        const fetchDados = async () => {
            setIsLoading(true);
            setErro('');
            try {
                // Remove chaves vazias do objeto de filtros antes de enviar para a API
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
                setPaginaAtual(1); // Reseta para a primeira página após uma nova busca

            } catch (error) {
                console.error("Erro ao carregar pacotes:", error);
                setErro("Não foi possível carregar os pacotes. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDados();
    }, [filtrosAplicados]); // Re-executa a busca sempre que os filtros aplicados mudarem

    // ✅ 'useMemo' para calcular apenas os pacotes da página atual, otimizando a performance
    const pacotesDaPaginaAtual = useMemo(() => {
        const primeiroIndice = (paginaAtual - 1) * PACOTES_POR_PAGINA;
        const ultimoIndice = primeiroIndice + PACOTES_POR_PAGINA;
        return todosOsPacotes.slice(primeiroIndice, ultimoIndice);
    }, [paginaAtual, todosOsPacotes]);

    // --- HANDLERS PARA INTERAÇÃO ---
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = (event) => {
        event.preventDefault();
        setFiltrosAplicados(filtros);
    };

    return (
        <>
            {/* Seção de Busca e Filtros */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Para onde gostaria de ir?</h1>

                <form onSubmit={handleApplyFilters} className="space-y-4">
                    {/* Barra de Pesquisa Principal */}
                    <div className="max-w-xl mx-auto flex items-center bg-blue-800 p-2 rounded-lg shadow-lg">
                        <input
                            name="destino"
                            type="text"
                            value={filtros.destino}
                            onChange={handleInputChange}
                            placeholder="Busque por destino..."
                            className="flex-grow w-full bg-transparent border-none text-lg font-bold text-white placeholder-blue-300 focus:outline-none focus:ring-0"
                        />
                        <button type="submit" className="bg-white text-blue-800 rounded-md p-3 shadow-md transform hover:scale-105 transition-transform">
                            <Search size={24} />
                        </button>
                    </div>

                    {/* Filtros Avançados */}
                    <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                        <input type="number" name="precoMin" value={filtros.precoMin} onChange={handleInputChange} placeholder="Preço Mín." className="p-2 border rounded"/>
                        <input type="number" name="precoMax" value={filtros.precoMax} onChange={handleInputChange} placeholder="Preço Máx." className="p-2 border rounded"/>
                        <input type="date" name="dataInicio" value={filtros.dataInicio} onChange={handleInputChange} className="p-2 border rounded"/>
                        <input type="date" name="dataFim" value={filtros.dataFim} onChange={handleInputChange} className="p-2 border rounded"/>
                    </div>
                </form>
            </div>

            {/* Seção dos Cards */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Destinos Populares</h2>
                {isLoading ? (
                    <div className="text-center p-10 font-bold">Buscando melhores destinos...</div>
                ) : erro ? (
                    <p className="text-center text-red-500 py-10">{erro}</p>
                ) : pacotesDaPaginaAtual.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {pacotesDaPaginaAtual.map((pacote) => (
                                <Link key={pacote.id} to={`/pacotes/${pacote.id}`} className="block h-full">
                                    <Card pacote={pacote} />
                                </Link>
                            ))}
                        </div>
                        <Pagination
                            paginaAtual={paginaAtual}
                            totalPaginas={totalPaginas}
                            onPageChange={setPaginaAtual}
                        />
                    </>
                ) : (
                    <p className="text-center text-gray-500 py-10">Nenhum pacote encontrado com os filtros selecionados. Tente ajustar sua busca!</p>
                )}
            </div>
        </>
    );
}
