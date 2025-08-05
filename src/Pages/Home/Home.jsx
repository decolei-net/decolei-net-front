import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, DollarSign, CreditCard, Calendar, CalendarCheck, Clock } from 'lucide-react';
import pacoteService from '../../services/pacoteServices.js';
import avaliacaoService from '../../services/avaliacoesServices.js';
import Card from '../../components/Card';
import CardSkeleton from '../../components/CardSkeleton';
import Tooltip from '../../components/Tooltip';
import Pagination from '../../components/Pagination';

const PACOTES_POR_PAGINA = 12;
const PACOTES_VISTOS_KEY = 'pacotesVistosRecentemente';

const VisuallyHidden = ({ children }) => (
  <span
    className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
    style={{ clip: 'rect(0, 0, 0, 0)' }}
  >
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
          }),
        );
        setTodosOsPacotes(pacotesCompletos);
        setPaginaAtual(1);
      } catch (error) {
        console.error('Erro ao carregar pacotes:', error);
        setErro('Não foi possível carregar os pacotes. Tente novamente mais tarde.');
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
        console.error('Erro ao analisar o histórico de visualização:', e);
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
      setStatusMessage(
        `Busca concluída. ${todosOsPacotes.length} pacotes encontrados. Exibindo página ${paginaAtual} de ${totalPaginas}.`,
      );
    } else {
      setStatusMessage('Nenhum pacote encontrado com os filtros selecionados.');
    }
  }, [
    isLoading,
    erro,
    pacotesDaPaginaAtual.length,
    paginaAtual,
    totalPaginas,
    todosOsPacotes.length,
  ]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if ((name === 'precoMin' || name === 'precoMax') && parseFloat(value) < 0) {
      return;
    }
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    setFiltrosAplicados(filtros);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
      <VisuallyHidden role="status" aria-live="polite">
        {statusMessage}
      </VisuallyHidden>

      {/* Hero Section - Full Width */}
      <div className="relative w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-6 py-16 lg:py-24">
          <div className="max-w-5xl mx-auto">
            <h1
              id="main-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight"
            >
              Para onde você
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                {' '}
                deseja ir?
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Descubra destinos incríveis e crie memórias inesquecíveis com nossos pacotes
              exclusivos
            </p>

            {/* Search Form */}
            <form
              onSubmit={handleApplyFilters}
              className="space-y-6 max-w-4xl mx-auto"
              role="search"
              aria-labelledby="main-heading"
            >
              {/* Main Search Bar */}
              <div className="relative">
                <div className="flex items-center bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-2xl border border-white/20 focus-within:ring-4 focus-within:ring-white/30 transition-all duration-500 hover:shadow-3xl">
                  <label htmlFor="destino-search" className="sr-only">
                    Busque por destino, hotel ou cidade
                  </label>
                  <input
                    id="destino-search"
                    name="destino"
                    type="text"
                    value={filtros.destino}
                    onChange={handleInputChange}
                    placeholder="Para onde você quer viajar? Digite o destino dos seus sonhos..."
                    className="flex-grow w-full bg-transparent border-none text-gray-800 placeholder-gray-500 focus:outline-none text-lg px-4 font-medium"
                  />
                  <button
                    type="submit"
                    aria-label="Buscar pacotes"
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl px-6 py-3 shadow-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 font-semibold text-sm flex items-center gap-2"
                  >
                    <Search size={20} />
                    Buscar
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="group">
                  <label
                    htmlFor="precoMin"
                    className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2"
                  >
                    <Tooltip content="Defina o valor mínimo para filtrar pacotes">
                      <DollarSign size={16} />
                    </Tooltip>
                    Preço Mínimo
                  </label>
                  <input
                    id="precoMin"
                    type="number"
                    name="precoMin"
                    value={filtros.precoMin}
                    onChange={handleInputChange}
                    placeholder="R$ 0"
                    className="w-full p-3 border-0 rounded-xl shadow-lg text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-white/30 transition-all duration-300 bg-white/95 backdrop-blur-sm font-medium"
                  />
                </div>
                <div className="group">
                  <label
                    htmlFor="precoMax"
                    className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2"
                  >
                    <Tooltip content="Defina o valor máximo que você gostaria de pagar">
                      <CreditCard size={16} />
                    </Tooltip>
                    Preço Máximo
                  </label>
                  <input
                    id="precoMax"
                    type="number"
                    name="precoMax"
                    value={filtros.precoMax}
                    onChange={handleInputChange}
                    placeholder="R$ 10.000"
                    className="w-full p-3 border-0 rounded-xl shadow-lg text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-white/30 transition-all duration-300 bg-white/95 backdrop-blur-sm font-medium"
                  />
                </div>
                <div className="group">
                  <label
                    htmlFor="dataInicio"
                    className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2"
                  >
                    <Tooltip content="Quando você gostaria de partir">
                      <Calendar size={16} />
                    </Tooltip>
                    Data de Partida
                  </label>
                  <input
                    id="dataInicio"
                    type="date"
                    name="dataInicio"
                    value={filtros.dataInicio}
                    onChange={handleInputChange}
                    className="w-full p-3 border-0 rounded-xl shadow-lg text-gray-800 focus:ring-4 focus:ring-white/30 transition-all duration-300 bg-white/95 backdrop-blur-sm font-medium"
                  />
                </div>
                <div className="group">
                  <label
                    htmlFor="dataFim"
                    className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2"
                  >
                    <Tooltip content="Quando você planeja retornar">
                      <CalendarCheck size={16} />
                    </Tooltip>
                    Data de Retorno
                  </label>
                  <input
                    id="dataFim"
                    type="date"
                    name="dataFim"
                    value={filtros.dataFim}
                    onChange={handleInputChange}
                    className="w-full p-3 border-0 rounded-xl shadow-lg text-gray-800 focus:ring-4 focus:ring-white/30 transition-all duration-300 bg-white/95 backdrop-blur-sm font-medium"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <main className="container max-w-7xl mx-auto px-6 py-12">
        {historicoVisualizacao.length > 0 && (
          <section className="mb-16" aria-labelledby="vistos-recentemente-heading">
            <div className="text-center mb-8">
              <h2
                id="vistos-recentemente-heading"
                className="text-3xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3"
              >
                <Clock size={32} className="text-blue-600" />
                Vistos Recentemente
              </h2>
              <p className="text-gray-600 text-lg">Destinos que chamaram sua atenção</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {historicoVisualizacao.map((pacote) => (
                <Link
                  key={`hist-${pacote.id}`}
                  to={`/pacotes/${pacote.id}`}
                  className="block h-full"
                  aria-label={`Ver detalhes do pacote para ${pacote.destino}`}
                >
                  <div className="relative h-full">
                    <Card pacote={pacote} />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                      Visto recentemente
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="destinos-heading">
          <div className="text-center mb-12">
            <h2 id="destinos-heading" className="text-4xl font-bold text-gray-800 mb-4">
              ✨ Destinos em Destaque
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Explore nossos pacotes mais populares e encontre sua próxima aventura
            </p>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(12)].map((_, index) => (
                <CardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : erro ? (
            <div className="text-center p-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-red-600 text-lg font-semibold" role="alert">
                {erro}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors duration-300"
              >
                Tentar Novamente
              </button>
            </div>
          ) : pacotesDaPaginaAtual.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {pacotesDaPaginaAtual.map((pacote) => (
                  <Link
                    key={pacote.id}
                    to={`/pacotes/${pacote.id}`}
                    className="block h-full"
                    aria-label={`Ver detalhes do pacote para ${pacote.destino}`}
                  >
                    <Card pacote={pacote} />
                  </Link>
                ))}
              </div>
              <div className="mt-12 flex justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-100">
                  <Pagination
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    onPageChange={setPaginaAtual}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Nenhum pacote encontrado</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                Não encontramos destinos com os filtros selecionados. Que tal ajustar sua busca e
                descobrir novas aventuras?
              </p>
              <button
                onClick={() => {
                  setFiltros({
                    destino: '',
                    precoMin: '',
                    precoMax: '',
                    dataInicio: '',
                    dataFim: '',
                  });
                  setFiltrosAplicados({});
                }}
                className="mt-6 bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-300 font-semibold"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
